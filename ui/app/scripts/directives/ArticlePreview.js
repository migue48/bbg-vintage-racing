'use strict';

var articlePreview = angular.module('articlePreview', []);

/**
 * The articlePreview directive is used to generate article preview views.
 * Currently, the preview is based on the first two paragraphs in the
 * article.
 */
articlePreview.directive('articlePreview', function() {
  return {
    // The restrict option can be se to:
    //   - 'A' - only matches attribute name
    //   - 'E' - only matches element name
    //   - 'C' - only matches class name
    // These options can be combined e.g. 'AEC'
    restrict: 'A',
    replace: true,
    link: function (scope, element, attrs) {
      var rawData;
      var articleId;

      /**
       * Find the N-th ending paragraph index of an input HTML string. The
       *     function searches for '</p>' tags n times.
       * @param {html} String containing HTML text.
       * @param {i} Start index for search operation.
       * @param {n} N-th order.
       * @return index of N-th end of paragraph, otherwise -1.
       */
      function FindEndOfNthParagraph(html, i, n) {
        var idx = html.indexOf('</p>', i);
        if (n == 0)
          return idx;

        return FindEndOfNthParagraph(html, idx + 1, n - 1);
      };

      /**
       * Generate the article preview. The current implementation generates
       * the preview using the first two paragraphs in the article.
       */
      function GenPreview() {
        var idx = FindEndOfNthParagraph(rawData, 0, 1);
        var prevHtml;
        if (idx < 0) {
          // Not enough paragraphs to generate preview.
          prevHtml = rawData;
        } else {
          prevHtml  = rawData.substring(0, idx) + '</p>';
          prevHtml += '<hr>';
          prevHtml += '<a href="/#/news/'+ articleId +'" class="bbg_red bbg_fnt_md pull-right">Read More <i class="fa fa-plus"></i></a>';
        }
        element.html(prevHtml);
      };

      scope.$watch(attrs.articlePreview, function(value) {
        rawData = value;
        articleId = attrs.id;
        GenPreview();
      });

    }
  };
});
