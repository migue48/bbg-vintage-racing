package forms

import java.util.UUID

import org.joda.time.DateTime
import play.api.data.Form
import play.api.data.Forms._
import play.api.libs.json.Json

/**
  *
  */
object AlbumForm {
  /**
    * A play framework form.
    */
  val form = Form(
    mapping(
      "userId" -> uuid,
      "title" -> optional(text),
      "description" -> optional(text),
      "language" -> text,
      "active" -> boolean,
      "date" -> optional(jodaDate),
      "city" -> optional(text),
      "images" -> seq (
        mapping (
          "src" -> text,
          "thumbnail" -> optional(text),
          "description" -> optional(text)
        )(ImageFormData.apply)(ImageFormData.unapply)
      )
    )(AlbumFormData.apply)(AlbumFormData.unapply)
  )

  case class ImageFormData(src: String,
                           thumbnail: Option[String],
                           description: Option[String])

  object ImageFormData {
    implicit val jsonFormat = Json.format[ImageFormData]
  }

  case class AlbumFormData(userId: UUID,
                           title: Option[String],
                           description: Option[String],
                           language: String,
                           active: Boolean,
                           date: Option[DateTime],
                           city: Option[String],
                           images: Seq[ImageFormData])

  object AlbumFormData {
    implicit val jsonFormat = Json.format[AlbumFormData]
  }
}
