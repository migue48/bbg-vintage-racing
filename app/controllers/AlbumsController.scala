package controllers

import java.util.UUID
import javax.inject.Inject

import com.mohiva.play.silhouette.api.{Silhouette, Environment}
import com.mohiva.play.silhouette.impl.authenticators.JWTAuthenticator
import com.mohiva.play.silhouette.impl.providers.SocialProviderRegistry
import models.{User,Album,Image}
import models.daos._
import play.api.i18n.MessagesApi
import play.api.libs.concurrent.Execution.Implicits._
import forms.AlbumForm
import play.api.libs.json._
import play.api.mvc._


import scala.concurrent.Future

/**
  * Created by migue48 on 12/7/15.
  */
class AlbumsController @Inject()(val messagesApi: MessagesApi,
                                 val env: Environment[User, JWTAuthenticator],
                                 socialProviderRegistry: SocialProviderRegistry,
                                 albumDAO: AlbumDAO)
  extends Silhouette[User, JWTAuthenticator]  {

  def create = SecuredAction.async(parse.json) { implicit request =>
    request.body.validate[AlbumForm.AlbumFormData].map { data =>
      val album = Album(
        id = UUID.randomUUID(),
        userId = data.userId,
        title = data.title,
        description = data.description,
        language = data.language,
        date = data.date,
        city = data.city,
        cover = data.cover,
        images = data.images.map { img =>
          Image (
            id = UUID.randomUUID(),
            src = img.src,
            thumbnail = img.thumbnail,
            description = img.description
          )
        },
        active = data.active
      )
      albumDAO.save(album)
      Future.successful(Created(s"Album Created"))
    }.recoverTotal{ error => Future.successful(BadRequest(JsError.toJson(error)))}
  }

  def update(id:UUID) = SecuredAction.async(parse.json) { request =>
    request.body.validate[AlbumForm.AlbumFormData].map { data =>
      albumDAO.find(id).flatMap {
        case Some(album) =>
          val updatedAlbum = album.copy(
            description = data.description,
            title = data.title,
            date = data.date,
            language = data.language,
            city = data.city,
            cover = data.cover,
            images = data.images.map { img =>
              Image(
                // TODO: Update method to keep old image id's.
                id = UUID.randomUUID(),
                src = img.src,
                thumbnail = img.thumbnail,
                description = img.description
              )
            },
            active = data.active
          )
          albumDAO.save(updatedAlbum)
          Future.successful(Created(s"Album Updated"))
        case None =>
          Future.successful(BadRequest(s"Album does not exist in database"))
      }
    }.recoverTotal( error => Future.successful(BadRequest(JsError.toJson(error))))
  }

  def delete(id: UUID) = SecuredAction.async {
    albumDAO.find(id).flatMap {
      case Some(album) =>
        albumDAO.destroy(album)
        Future.successful(Ok(s"Deleted Album"))
      case None =>
        Future.successful(BadRequest(s"Album does not exist in database"))
    }
  }

  def show(id: UUID) = Action.async {
    albumDAO.find(id).flatMap {
      case Some(album) =>
        Future.successful(Ok(Json.obj("album" -> album)))
      case None =>
        Future.successful(NotFound)
    }
  }

  def findAll() = Action.async {

    val futureAlbumsList: Future[List[Album]] = albumDAO.findAll()

    // transform the list into a JsArray
    val futureAlbumsJsonArray: Future[JsArray] = futureAlbumsList.map { albums =>
      Json.arr(albums)
    }

    // everything's ok! Let's reply with the array
    futureAlbumsJsonArray.map {
      events =>
        Ok(events.value.head)
    }
  }
}
