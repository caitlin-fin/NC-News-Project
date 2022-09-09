\c nc_news_test

SELECT articles.*, COUNT(comments.article_id) :: INT AS comment_count FROM articles 
  LEFT JOIN comments ON (articles.article_id=comments.article_id)
  WHERE articles.topic='cats'
 GROUP BY articles.article_id  ORDER BY created_at asc