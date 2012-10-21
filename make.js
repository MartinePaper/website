#!/usr/bin/env node
// make.js -- generate website pages

var fs = require('fs');
var path = require('path');
var Handlebars = require('handlebars');
var mkdirp = require('mkdirp');
var config = require('./config.json');

var headerTemplateText = fs.readFileSync('./templates/header.hbrs').toString();
var headerTemplate = Handlebars.compile(headerTemplateText);

var homeTemplateText = fs.readFileSync('./templates/home.hbrs').toString();
var homeTemplate = Handlebars.compile(homeTemplateText);

var collectionsTemplateText = fs.readFileSync('./templates/collections.hbrs').toString();
var collectionsTemplate = Handlebars.compile(collectionsTemplateText);

var invitationTemplateText = fs.readFileSync('./templates/invitation-page.hbrs').toString();
var invitationTemplate = Handlebars.compile(invitationTemplateText);

var contactTemplateText = fs.readFileSync('./templates/contact.hbrs').toString();
var contactTemplate = Handlebars.compile(contactTemplateText);


// generate and output each invitation page

var i, index, invitation;
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

	invitation.headerHtml = headerTemplate({ active: 'collections' });

	invitation.prevName = invitations[(i === 0) ? invitations.length - 1 : i - 1].name;
	invitation.nextName = invitations[(i === invitations.length - 1) ? 0 : i + 1].name;
	invitation.nameUpperCase = invitation.name[0].toUpperCase() + invitation.name.slice(1);

	invitation.isVertical = invitation.orientation === 'vertical';
	invitation.isHorizontal = invitation.orientation === 'horizontal';

	createInvitationPage(invitation);
}

createCollectionPage({
	rows: invitationGrid,
	headerHtml: headerTemplate({ active: 'collections' })
});


createHomePage(featured)

createContactPage( { headerHtml: headerTemplate( { active: 'about' } ) } );

function createPage(pageHtml, relativePath, name) {
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

function createInvitationPage(invitation) {
	var pageHtml = invitationTemplate(invitation);
	createPage(pageHtml, './collections/' + invitation.name);
}

function createCollectionPage(grid) {
	var pageHtml = collectionsTemplate(grid);
	createPage(pageHtml, './collections');
}

function createContactPage(contact) {
	var pageHtml = contactTemplate(contact);
	createPage(pageHtml, './contact');
}

function createHomePage(featured) {
	var pageHtml = homeTemplate(featured);
	createPage(pageHtml, './');
}