/**
  * Copyright (C) 2015-2016 Miguel Osorio. All rights reserved.
  */
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
import play.api.libs.json._
import play.api.mvc._


import scala.concurrent.Future


/**
  * The news controller. This controller implements the CRUD functionality for the article model.
  */
class NewsController @Inject()(val messagesApi: MessagesApi,
                               val env: Environment[User, JWTAuthenticator],
                               socialProviderRegistry: SocialProviderRegistry,
                               articleDAO: ArticleDAO)
  extends Silhouette[User, JWTAuthenticator] {

  def create = SecuredAction.async(parse.json) { implicit request =>
    request.body.validate[Article].map { article =>
      val newArticle = article.copy(id = Some(UUID.randomUUID()))
      articleDAO.save(newArticle)
      Future.successful(Created(s"Article Created"))
    }.recoverTotal(error => Future.successful(BadRequest(JsError.toJson(error))))
  }

  def update(id:UUID) = SecuredAction.async(parse.json) { request =>
    request.body.validate[Article].map { updatedArticle =>
      articleDAO.find(id).flatMap {
        case Some(article) =>
          articleDAO.save(updatedArticle)
          Future.successful(Created(s"Article Updated"))
        case None =>
          Future.successful(BadRequest(s"Article does not exist in database"))
      }
    }.recoverTotal(error => Future.successful(BadRequest(JsError.toJson(error))))
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

  def list(active: Option[Boolean],
           pagestart: Option[Int],
           pagesize: Option[Int],
           language: Option[String]) = Action.async {

    val futureArticlesList: Future[List[Article]] = articleDAO.findAll(active, language)

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
