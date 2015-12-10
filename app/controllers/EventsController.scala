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
import forms.EventForm
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
    request.body.validate[EventForm.Data].map { data =>
      val event = Event(
        id = UUID.randomUUID(),
        userId = data.userId,
        title = data.title,
        description = data.description,
        address = Some(data.address),
        city = data.city,
        startDate = data.startDate,
        endDate = Some(data.endDate),
        language = data.language,
        image = data.image,
        imageSource = Some(data.imageSrc),
        active = data.active
      )
      eventDAO.save(event)
      Future.successful(Created(s"Event Created"))
    }.recoverTotal{ error => Future.successful(BadRequest(JsError.toJson(error)))}
  }

  def update(id:UUID) = SecuredAction.async(parse.json) { request =>
    request.body.validate[EventForm.Data].map { data =>
      eventDAO.find(id).flatMap {
        case Some(article) =>
          val updatedEvent = article.copy(
            title = data.title,
            description = data.description,
            address = Some(data.address),
            city = data.city,
            startDate = data.startDate,
            endDate = Some(data.endDate),
            language = data.language,
            image = data.image,
            imageSource = Some(data.imageSrc),
            active = data.active
          )
          eventDAO.save(updatedEvent)
          Future.successful(Created(s"Event Updated"))
        case None =>
          Future.successful(BadRequest(s"Event does not exist in database"))
      }
    }.getOrElse(Future.successful(BadRequest(s"Invalid json")))
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

  def findAll() = Action.async {

    val futureEventsList: Future[List[Event]] = eventDAO.findAll()

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
