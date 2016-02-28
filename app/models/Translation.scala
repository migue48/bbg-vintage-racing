/**
  * Copyright (C) 2016 Miguel Osorio. All rights reserved.
  */
package models

import java.util.UUID
import play.api.libs.json.Json


/**
  * Object used to store links to object translations.
  *
  * @param language: Translation language.
  * @param id: The id of the object.
  */
case class Translation (language: String, id: UUID)

object Translation {
  implicit val jsonFormat = Json.format[Translation]
}
