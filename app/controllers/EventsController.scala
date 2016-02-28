package controllers

import java.util.UUID
import javax.inject.Inject

import com.mohiva.play.silhouette.api.{Silhouette, Environment}
import com.mohiva.play.silhouette.impl.authenticators.JWTAuthenticator
import com.mohiva.play.silhouette.impl.providers.SocialProviderRegistry
import models.{User,Event}
import models.daos._
import play.api.i18n.MessagesApi
import play.api.libs.concurrent.Execution.Implicits._
import play.api.libs.json._
import play.api.mvc._


import scala.concurrent.Future

/**
  * Created by migue48 on 12/7/15.
  */
class EventsController @Inject()(val messagesApi: MessagesApi,
                                 val env: Environment[User, JWTAuthenticator],
                                 socialProviderRegistry: SocialProviderRegistry,
                                 eventDAO: EventDAO)
  extends Silhouette[User, JWTAuthenticator]  {

  def create = SecuredAction.async(parse.json) { implicit request =>
    request.body.validate[Event].map { event =>
      val newEvent = event.copy(id = Some(UUID.randomUUID()))
      eventDAO.save(newEvent)
      Future.successful(Created(s"Event Created"))
    }.recoverTotal{ error => Future.successful(BadRequest(JsError.toJson(error)))}
  }

  def update(id:UUID) = SecuredAction.async(parse.json) { request =>
    request.body.validate[Event].map { updatedEvent =>
      eventDAO.find(id).flatMap {
        case Some(article) =>
          if (updatedEvent.id != article.id) {
            Future.successful(BadRequest(s"Invalid object id"))
          } else {
            eventDAO.save(updatedEvent)
            Future.successful(Created(s"Event Updated"))
          }
        case None =>
          Future.successful(BadRequest(s"Event does not exist in database"))
      }
    }.recoverTotal( error => Future.successful(BadRequest(JsError.toJson(error))))
  }

  def delete(id: UUID) = SecuredAction.async {
    eventDAO.find(id).flatMap {
      case Some(event) =>
        eventDAO.destroy(event)
        Future.successful(Ok(s"Deleted Event"))
      case None =>
        Future.successful(BadRequest(s"Event does not exist in database"))
    }
  }

  def show(id: UUID) = Action.async {
    eventDAO.find(id).flatMap {
      case Some(event) =>
        Future.successful(Ok(Json.obj("event" -> event)))
      case None =>
        Future.successful(NotFound)
    }
  }

  def list(active: Option[Boolean],
           pagestart: Option[Int],
           pagesize: Option[Int],
           language: Option[String])  = Action.async {

    val futureEventsList: Future[List[Event]] = eventDAO.findAll(active, language)

    // transform the list into a JsArray
    val futureEventsJsonArray: Future[JsArray] = futureEventsList.map { events =>
      Json.arr(events)
    }

    // everything's ok! Let's reply with the array
    futureEventsJsonArray.map {
      events =>
        Ok(events.value.head)
    }
  }
}
