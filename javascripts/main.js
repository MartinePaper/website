
(function() {

	// Initial Setup
	$(function() {
		$('.image-thumbnails').find('a').click(function(e) {
			e.preventDefault();
			var anchor = $(e.currentTarget);
			var detailSize = anchor.attr('data-detail-size');
			var detailOrientation = anchor.attr('data-detail-orientation');
			var sectionOrientation = $('#invitation-detail-section').attr('data-section-layout-orientation')
			var imgSrc = anchor.find('img').attr('data-detail-image');
			var detailContainer = $('#invitation-detail-image-container')
			detailContainer.empty();
			var detailImage = $('<img class="invitation-detail-image" alt="">');
			detailImage.addClass('invitation-detail-' + detailSize + '-' + detailOrientation);
			detailImage.attr('src', imgSrc);
			detailContainer.append(detailImage);
			return false;
		});
	});

})();