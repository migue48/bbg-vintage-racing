package controllers

import java.util.UUID
import javax.inject.Inject

import com.mohiva.play.silhouette.api.{Silhouette, Environment}
import com.mohiva.play.silhouette.impl.authenticators.JWTAuthenticator
import com.mohiva.play.silhouette.impl.providers.SocialProviderRegistry
import models.{User,Article}
import models.daos._
import play.api.i18n.{Messages, MessagesApi}
import play.api.libs.concurrent.Execution.Implicits._
import forms.ArticleForm
import play.api.libs.json._
import play.api.mvc._


import scala.concurrent.Future


/**
  * The news controller.
  *
  *
  */
class NewsController @Inject()(val messagesApi: MessagesApi,
                               val env: Environment[User, JWTAuthenticator],
                               socialProviderRegistry: SocialProviderRegistry,
                               articleDAO: ArticleDAO)
  extends Silhouette[User, JWTAuthenticator] {

  def create = SecuredAction.async(parse.json) { implicit request =>
    request.body.validate[ArticleForm.Data].map { data =>
      val article = Article(
        id = UUID.randomUUID(),
        title = Some(data.title),
        content = Some(data.content),
        userId = data.userId,
        language = data.language,
        active = data.active,
        creationDate = None,
        updateDate = None
      )
      articleDAO.save(article)
      Future.successful(Created(s"Article Created"))
    }.getOrElse(Future.successful(BadRequest(s"invalid json")))
  }

  def update(id:UUID) = SecuredAction.async(parse.json) { request =>
    request.body.validate[ArticleForm.Data].map { data =>
      articleDAO.find(id).flatMap {
        case Some(article) =>
          val newArticle = article.copy(
            title = Some(data.title),
            content = Some(data.content),
            active = data.active,
            language = data.language
          )
          articleDAO.save(newArticle)
          Future.successful(Created(s"Article Updated"))
        case None =>
          Future.successful(BadRequest(s"Article does not exist in database"))
      }
    }.getOrElse(Future.successful(BadRequest(s"Invalid json")))
  }

  def delete(id: UUID) = SecuredAction.async {
    articleDAO.find(id).flatMap {
      case Some(article) =>
        articleDAO.destroy(article)
        Future.successful(Ok(s"Deleted Article"))
      case None =>
        Future.successful(BadRequest(s"Article does not exist in database"))
    }
  }

  def show(id: UUID) = Action.async {
      articleDAO.find(id).flatMap {
        case Some(article) =>
          Future.successful(Ok(Json.obj("article" -> article)))
        case None =>
          Future.successful(NotFound)
      }
  }

  def findAll() = Action.async {

    val futureArticlesList: Future[List[Article]] = articleDAO.findAll()

    // transform the list into a JsArray
    val futureNewsJsonArray: Future[JsArray] = futureArticlesList.map { articles =>
      Json.arr(articles)
    }

    // everything's ok! Let's reply with the array
    futureNewsJsonArray.map {
      articles =>
        Ok(articles.value(0))
    }
  }

}
