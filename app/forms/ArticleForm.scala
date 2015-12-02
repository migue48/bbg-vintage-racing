package forms

import java.util.UUID

import play.api.data.Form
import play.api.data.Forms._
import play.api.libs.json.Json

/**
  * Created by migue48 on 11/22/15.
  */
object ArticleForm {
  /**
    * A play framework form.
    */
  val form = Form(
    mapping(
      "title" -> text,
      "userId" -> uuid,
      "content" -> text,
      "language" -> text,
      "active" -> boolean
    )(Data.apply)(Data.unapply)
  )

  /**
    * The form data.
    *
    * @param title: The title of the article.
    * @param userId: The author's user ID.
    * @param content: The content of the article.
    * @param language: The language of the article.
    * @param active: Setting to enable/disable the article.
    */
  case class Data( title: String,
                   userId: UUID,
                   content: String,
                   language: String,
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
