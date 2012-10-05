
(function() {

	// Initial Setup
	$(function() {
		$('.image-thumbnails').find('a').click(function(e) {
			var anchor = $(e.currentTarget);
			var detailSize = anchor.attr('data-detail-size');
			var detailOrientation = anchor.attr('data-detail-orientation');
			var sectionOrientation = $('#invitation-detail-section').attr('data-section-layout-orientation')
			var imgSrc = anchor.find('img').attr('src');
			var detailContainer = $('#invitation-detail-picture')
			detailContainer.empty();
			var detailImage = $('<img class="invitation-detail-image" alt="">');
			detailImage.addClass('invitation-detail-' + sectionOrientation + '-content')
			detailImage.addClass('invitation-detail-' + detailSize + '-' + detailOrientation);
			detailImage.attr('src', imgSrc);
			detailContainer.append(detailImage);
		});
	});

})();