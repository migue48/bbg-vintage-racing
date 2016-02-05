package models

import java.util.UUID
import org.joda.time.DateTime
import play.api.libs.json.Json


case class Image (id: UUID,
                  src: String,
                  thumbnail: Option[String],
                  description: Option[String])

object Image {
  /**
    * Converts the [Article] object to Json and vice versa.
    */
  implicit val jsonFormat = Json.format[Image]
}

/**
  * The Album object.
  *
  * @param id: The unique id for the album.
  * @param userId:
  * @param description: The album's description.
  * @param language:
  * @param date: Date in which the images were taken.
  * @param city: Location in which the images were taken.
  * @param creationDate: BBG album creation date.
  * @param updateDate: Last update date.
  * @param images: List of images.
  * @param cover: The album's cover image.
  * @param active: Flag to enable/disable the album.
  */
case class Album(id: UUID,
                 userId: UUID,
                 title: Option[String] = None,
                 description: Option[String],
                 language: String,
                 date: Option[DateTime],
                 city: Option[String],
                 creationDate: Option[DateTime] = Some(DateTime.now()),
                 updateDate: Option[DateTime] = Some(DateTime.now()),
                 images: Seq[Image],
                 cover: Option[String],
                 active:Boolean) {

}

object Album {
  /**
    * Converts the [Album] object to Json and vice versa.
    */
  implicit val jsonFormat = Json.format[Album]

  val collectionName = "albums"
}
