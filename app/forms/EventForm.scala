package forms

import java.util.UUID

import play.api.data.Form
import play.api.data.Forms._
import play.api.libs.json.Json
import org.joda.time.DateTime

/**
  * Created by migue48 on 12/8/15.
  */
object EventForm {
  /**
    * A play framework form.
    */
  val form = Form(
    mapping(
      "title" -> text,
      "userId" -> uuid,
      "description" -> text,
      "language" -> text,
      "startDate" -> jodaDate,
      "endDate" -> jodaDate,
      "address" -> text,
      "city" -> text,
      "image" -> text,
      "imageSource" -> text,
      "active" -> boolean
    )(Data.apply)(Data.unapply)
  )

  /**
    *
    * @param title The event's title.
    * @param userId Event's user ID.
    * @param description Event's description.
    * @param language Event's display language.
    * @param startDate Event's start date.
    * @param endDate Event's end date.
    * @param address Event's address.
    * @param city Event's city.
    * @param image Image URL.
    * @param imageSource Image source URL.
    * @param active Display flag (true/false).
    */
  case class Data( title: String,
                   userId: UUID,
                   description: String,
                   language: String,
                   startDate: DateTime,
                   endDate: DateTime,
                   address: String,
                   city: String,
                   image: String,
                   imageSource: String,
                   active: Boolean)

  /**
    * The companion object.
    */
  object Data {

    /**
      * Converts the [Data] object to Json and vice versa.
      */
    implicit val jsonFormat = Json.format[Data]
  }
}
