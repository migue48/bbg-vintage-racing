package models.daos

import java.util.UUID
import javax.inject.Inject

import models.Album
import org.joda.time.DateTime
import play.api.libs.json.Json
import scala.concurrent.ExecutionContext.Implicits.global
import play.modules.reactivemongo.json.collection.JSONCollection
import reactivemongo.api._

import play.modules.reactivemongo.json._
import play.modules.reactivemongo.json.collection._

import scala.concurrent.Future


class AlbumDAO @Inject() (db : DB)  {
  def collection: JSONCollection = db.collection[JSONCollection](Album.collectionName)

  /**
    * Finds an album by its ID.
    *
    * @param albumId The ID of the event to find.
    * @return The found album or None if no album for the given ID could be found.
    */
  def find(albumId: UUID) : Future[Option[Album]] = {
    collection.find(Json.obj("id" -> albumId)).one[Album]
  }

  /**
    * Finds all active albums.
    * @return The list of active albums.
    */
  def findAll(active: Option[Boolean], language: Option[String]) : Future[List[Album]] = {
    val cursor: Cursor[Album] = collection
      .find(Json.obj(
        "active" -> active.getOrElse[Boolean](true),
        "language" -> language.getOrElse[String]("en")
      ))
      .sort(Json.obj("date" -> 1))
      .cursor[Album]()
    cursor.collect[List]()
  }

  /**
    * Saves an album.
    *
    * @param album The album to save.
    * @return The saved album.
    */
  def save(album: Album) : Future[Option[Album]] = {
    val updatedAlbum = album.copy(
      creationDate = album.creationDate.orElse(Some(DateTime.now)),
      updateDate = Some(DateTime.now)
    )

    collection.update(Json.obj("id" -> updatedAlbum.id),
      updatedAlbum,
      upsert = true)
    Future.successful(Some(updatedAlbum))
  }


  def destroy(album: Album) = {
    collection.remove(Json.obj("id" -> album.id))
  }
}
