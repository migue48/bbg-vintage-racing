/**
  * Copyright (C) 2015-2016 Miguel Osorio. All rights reserved.
  */
package extensions.Binders

import java.util.UUID

/**
  * Created by migue48 on 11/23/15.
  */
object Binders {
  implicit def uuidPathBinder = new play.api.mvc.PathBindable[UUID] {
    override def bind(key: String, value: String): Either[String, UUID] = {
      try {
        Right(UUID.fromString(value))
      } catch {
        case e: IllegalArgumentException => Left("Id must be a UUID")
      }
    }
    override def unbind(key: String, value: UUID): String = value.toString
  }
}
