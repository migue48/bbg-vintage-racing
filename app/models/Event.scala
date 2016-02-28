/**
  * Copyright (C) 2016 Miguel Osorio. All rights reserved.
  */

package models

import java.util.UUID
import org.joda.time.DateTime
import play.api.libs.json.Json

/**
  * The Event object.
  *
  * @param id: The unique ID for the event.
  * @param userId: The event's user ID.
  * @param language: The event's language.
  * @param image: Event's image URL. Check CSP for valid sources.
  * @param imageSource: Image's source URL if not owned by BBG Vintage Racing (optional).
  * @param title: Event's title.
  * @param description: Event's short description.
  * @param address: Event's address.
  * @param city: Event's city.
  * @param startDate: Event's start date.
  * @param endDate: Event's end date (optional).
  * @param creationDate: The date in which the Event was created in the database.
  * @param updateDate: The date in which the Event was last updated.
  * @param translations: Available translations.
  * @param active: Flag to enable/disable the event.
  */
case class Event (id: Option[UUID],
                  userId: UUID,
                  language:String,
                  image:String = "",
                  imageSource:Option[String] = None,
                  title:String,
                  description:String,
                  address:Option[String] = None,
                  city:String,
                  startDate:DateTime,
                  endDate:Option[DateTime] = None,
                  creationDate:Option[DateTime] = None,
                  updateDate:Option[DateTime] = None,
                  translations: Option[Seq[Translation]] = None,
                  active:Boolean)

object Event {
  /**
    * Converts the [Event] object to Json and vice versa.
    */
  implicit val jsonFormat = Json.format[Event]
}