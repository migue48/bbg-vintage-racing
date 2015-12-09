package models.daos

import java.util.UUID
import javax.inject.Inject

import models.Article
import org.joda.time.DateTime
import play.api.libs.json.Json
import scala.concurrent.ExecutionContext.Implicits.global
import play.modules.reactivemongo.json.collection.JSONCollection
import reactivemongo.api._

import play.modules.reactivemongo.json._
import play.modules.reactivemongo.json.collection._

import scala.concurrent.Future

/**
  * Gives access to the article object.
  */
class ArticleDAO  @Inject() (db : DB)  {

  def collection: JSONCollection = db.collection[JSONCollection]("article")

  /**
    * Finds a article by its article ID.
    *
    * @param articleId The ID of the article to find.
    * @return The found article or None if no article for the given ID could be found.
    */
  def find(articleId: UUID) : Future[Option[Article]] = {
    collection.find(Json.obj("id" -> articleId)).one[Article]
  }

  /**
    * Finds all active articles.
    * @return The list of active articles.
    */
  def findAll() : Future[List[Article]] = {
    val cursor: Cursor[Article] = collection
      .find(Json.obj("active" -> true))
      .sort(Json.obj("created" -> -1))
      .cursor[Article]()
    cursor.collect[List]()
  }

  /**
    * Saves an article.
    *
    * @param article The article to save.
    * @return The saved article.
    */
  def save(article: Article) : Future[Option[Article]] = {
    val updatedArticle = article.copy(
      creationDate = article.creationDate.orElse(Some(DateTime.now)),
      updateDate = Some(DateTime.now)
    )
    collection.update(Json.obj("id" -> updatedArticle.id),
      updatedArticle,
      upsert = true)
    Future.successful(Some(updatedArticle))
  }


  def destroy(article: Article) = {
    // TODO: Handling of result value. Need to handle exceptions thrown by the remove method.
    // Proposal:
    //  val futureRemove = collection.remove(selector)
    //
    //  futureRemove.onComplete {
    //    case Failure(e) => throw e
    //    case Success(lasterror) => {
    //    println("successfully removed document")
    //    }
    //  }
    collection.remove(Json.obj("id" -> article.id))
  }
}
