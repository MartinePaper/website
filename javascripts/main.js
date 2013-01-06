
(function() {

	// Initial Setup
	$(function() {
		$('.image-thumbnails').find('a').click(function(e) {
			e.preventDefault();
			var anchor = $(e.currentTarget);
			var detailSize = anchor.attr('data-detail-size');
			var detailOrientation = anchor.attr('data-detail-orientation');
			var sectionOrientation = $('#invitation-detail-section').attr('data-section-layout-orientation');
			var imgElement = anchor.find('img');
			var imgSrc = imgElement.attr('data-detail-image');
			var detailContainerId = imgElement.attr('data-detail-target-id') || 'invitation-detail-image-container';
			var detailContainer = $('#' + detailContainerId);
			detailContainer.empty();
			var detailImage = $('<img class="invitation-detail-image" alt="">');
			detailImage.addClass('invitation-detail-' + detailSize + '-' + detailOrientation);
			detailImage.attr('src', imgSrc);
			detailContainer.append(detailImage);
			return false;
		});
	});

})();