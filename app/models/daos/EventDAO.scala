/**
  * Copyright (C) 2015-2016 Miguel Osorio. All rights reserved.
  */
package models.daos

import java.util.UUID
import javax.inject.Inject

import models.Event
import org.joda.time.DateTime
import play.api.libs.json.Json
import scala.concurrent.ExecutionContext.Implicits.global
import play.modules.reactivemongo.json.collection.JSONCollection
import reactivemongo.api._

import play.modules.reactivemongo.json._
import play.modules.reactivemongo.json.collection._

import scala.concurrent.Future

/**
  * Created by migue48 on 12/7/15.
  */
class EventDAO @Inject() (db : DB)  {
  def collection: JSONCollection = db.collection[JSONCollection]("event")

  /**
    * Finds an event by its ID.
    *
    * @param eventId The ID of the event to find.
    * @return The found event or None if no article for the given ID could be found.
    */
  def find(eventId: UUID) : Future[Option[Event]] = {
    collection.find(Json.obj("id" -> eventId)).one[Event]
  }

  /**
    * Finds all active events.
    * @return The list of active events.
    */
  def findAll(active: Option[Boolean], language: Option[String]) : Future[List[Event]] = {
    val cursor: Cursor[Event] = collection
      .find(Json.obj(
        "active" -> active.getOrElse[Boolean](true),
        "language" -> language.getOrElse[String]("en")
      ))
      .sort(Json.obj("startDate" -> 1))
      .cursor[Event]()
    cursor.collect[List]()
  }

  /**
    * Saves an article.
    *
    * @param event The event to save.
    * @return The saved event.
    */
  def save(event: Event) : Future[Option[Event]] = {
    val updatedEvent = event.copy(
        creationDate = event.creationDate.orElse(Some(DateTime.now)),
        updateDate = Some(DateTime.now)
      )

    collection.update(Json.obj("id" -> updatedEvent.id),
      updatedEvent,
      upsert = true)
    Future.successful(Some(event))
  }


  def destroy(event: Event) = {
    collection.remove(Json.obj("id" -> event.id))
  }
}
