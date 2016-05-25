package extensions


import java.util.UUID
import org.joda.time.DateTime
import play.api.mvc.{QueryStringBindable, PathBindable}


/**
  * Created by migue48 on 11/23/15.
  */
object Binders {

  implicit def uuidPathBinder = new PathBindable[UUID] {
    override def bind(key: String, value: String): Either[String, UUID] = {
      try {
        Right(UUID.fromString(value))
      } catch {
        case e: IllegalArgumentException => Left("Id must be a UUID")
      }
    }
    override def unbind(key: String, value: UUID): String = value.toString
  }

  /**
    * Converts date in long format into Joda time.
    */
  implicit def dateTimeBinder(implicit longBinder: QueryStringBindable[Long]) = new QueryStringBindable[org.joda.time.DateTime] {
    override def bind(key: String, params: Map[String, Seq[String]]): Option[Either[String, DateTime]] = {
      for {
        dateLong <- longBinder.bind(key, params)
      } yield {
        (dateLong) match {
          case Right(dateLong) => Right(new DateTime(dateLong))
          case _ => Left("Unable to convert to org.joda.time.DateTime")
        }
      }
    }
    override def unbind(key: String, value: DateTime): String = {
      longBinder.unbind(key, value.getMillis())
    }
  }

}
