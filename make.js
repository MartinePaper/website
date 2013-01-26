#!/usr/bin/env node
// make.js -- generate website pages

var fs = require('fs');
var path = require('path');
var Handlebars = require('handlebars');
var mkdirp = require('mkdirp');
var config = require('./config.json');

var headerTemplate = Handlebars.compile(fs.readFileSync('./templates/header.hbrs').toString());

var homeTemplate = Handlebars.compile(fs.readFileSync('./templates/home.hbrs').toString());

var collectionsTemplate = Handlebars.compile(fs.readFileSync('./templates/collections.hbrs').toString());

var invitationTemplate = Handlebars.compile(fs.readFileSync('./templates/invitation-page.hbrs').toString());

var contactTemplate = Handlebars.compile(fs.readFileSync('./templates/contact.hbrs').toString());

var contactTemplate = Handlebars.compile(fs.readFileSync('./templates/contact.hbrs').toString());

var processTemplate = Handlebars.compile(fs.readFileSync('./templates/process.hbrs').toString());

var faqTemplate = Handlebars.compile(fs.readFileSync('./templates/faq.hbrs').toString());

var priceTemplate = Handlebars.compile(fs.readFileSync('./templates/prices.hbrs').toString());

var testimonialsTemplate = Handlebars.compile(fs.readFileSync('./templates/testimonials.hbrs').toString());

var mystoryTemplate = Handlebars.compile(fs.readFileSync('./templates/my-story.hbrs').toString());


// generate and output each invitation page

var i, j, index, invitation;
var invitations = config.invitations;
var invitationGrid = [];
var invitationRow;
var featured = { 
	headerHtml: headerTemplate({ }),
	invitations: [] 
};

for (i = 0; i < invitations.length; i++) {
	invitation = invitations[i];

	// place in the main collections grid grid
	if (i % 3 === 0) {
		invitationRow = { invitations: [ invitation ]};
		invitationGrid.push(invitationRow);
	} else {
		invitationRow.invitations.push(invitation);
	}

	// if featured, place in the featured list
	if (invitation.featured) {
		invitation.featuredImageUrl = invitation.featuredImageUrl || '/images/collections/' + invitation.name + '_detail.png';
		if(featured.invitations.length === 0) {
			invitation.featuredActive = 'active';
		}
		featured.invitations.push(invitation);
	}

	invitation.activeNav = 'collections';

	invitation.prevName = invitations[(i === 0) ? invitations.length - 1 : i - 1].name;
	invitation.nextName = invitations[(i === invitations.length - 1) ? 0 : i + 1].name;
	invitation.nameUpperCase = invitation.name[0].toUpperCase() + invitation.name.slice(1);
	invitation.shareThis = false;
	if (invitation.images) {
		for (j = 0; j < invitation.images.length; j++) {
			var img = invitation.images[j];
			img.size = img.size || invitation.size;
			img.orientation = img.orientation || invitation.orientation;
			if (img.shareText) {
				invitation.shareImageUrl = 'http://martinepaper.com' + img.largeImageUrl;
				invitation.shareImageUrlEncoded = encodeURIComponent(invitation.shareImageUrl);
				invitation.shareText = img.shareText;
				invitation.shareTextEncoded = encodeURIComponent(invitation.shareText);
				invitation.shareLink = 'http://www.martinepaper.com/collections/' + invitation.name;
				invitation.shareLinkEncoded = encodeURIComponent(invitation.shareLink);
				invitation.shareThis = true;
			}
		}
	}

	invitation.isVertical = invitation.orientation === 'vertical';
	invitation.isHorizontal = invitation.orientation === 'horizontal';

	createPage(invitationTemplate, invitation, './collections/' + invitation.name);
}

createPage(collectionsTemplate, { rows: invitationGrid, activeNav: 'collections' }, './collections');

createPage(homeTemplate, featured, './');

createPage(contactTemplate, { activeNav: 'about' }, './contact');

createPage(processTemplate, { activeNav: 'design' }, './process');

createPage(faqTemplate, { activeNav: 'design' }, './faq');

createPage(priceTemplate, { activeNav: 'design' }, './prices');

var testimonials = config.testimonials;

for (i = 0; i < testimonials.length; i++) {
	var testimonial = testimonials[i];
	testimonial.defaultImageUrl = testimonial.images[0].largeImageUrl;
	testimonial.notFirst = (i > 0);
	testimonial.index = i;
}

createPage(testimonialsTemplate, { activeNav: 'design', testimonials: testimonials }, './testimonials');

createPage(mystoryTemplate, { activeNav: 'about' }, './my-story');

function createPage(template, pageData, relativePath, name) {
	pageData.activeNav = pageData.activeNav || 'home';
	pageData.headerHtml = pageData.headerHtml || headerTemplate( { active: pageData.activeNav } );

	var pageHtml = template(pageData);

	name = name || 'index.html';
	mkdirp(relativePath, function(err) {
		if(err) {
			console.error(err);
			return;
		}
		var filePath = path.join(relativePath, name);
		fs.writeFile(filePath, pageHtml, function(err) {
			if(err) {
				console.error(err);
				return;
			}
			console.log('Created ' + filePath);
		});
	});
}
