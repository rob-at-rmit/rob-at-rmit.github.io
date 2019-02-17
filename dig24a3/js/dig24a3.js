/**
 * DIG24 Programming for Digital Design, Study Period 4 2018/2019.
 * Assignment 3
 * Robert Beardow, Student ID 19209676.
 * 
 * This is the consolidated javascript file for assignment 3.
 */
$(function() {

    /*
     * Constants for article states and durations.
     */
    const ARTICLE_STATE_HIGHLIGHTED             = "subarticle-state-highlighted";
    const ARTICLE_STATE_HIGHLIGHTING            = "subarticle-state-highlighting";
    const ARTICLE_STATE_UNHIGHLIGHTING          = "subarticle-state-unhighlighting";
    const ARTICLE_STATE_HIGHLIGHT_DURATION      = 500;
    const ARTICLE_STATE_UNHIGHLIGHT_DURATION    = 300;

    /**
     * Handles the display of a particular sub article in the main topic section.
     */
    const showArticleContent = function(article) {

        const topic = article.parents(".topic");
        const topicDetail = topic.find(".topic-detail");
        const topicHeader = topic.find(".topic-header");

        // If the original content hasn't bee stashed, stash it for when it's reset
        if (typeof(topicDetail.data("originalcontent")) === "undefined") {
            topicDetail.data("originalcontent", topicDetail.html());
            topicHeader.data("originalcontent", topicHeader.html());
        }

        const articleDetail = article.find(".subarticle-detailedcontent");
        const articleHeader = article.find(".subarticle-headercontent");

        topicDetail.hide().html(articleDetail.html()).fadeIn("slow");
        topicHeader.hide().html(articleHeader.html()).fadeIn("slow");

        return $.Deferred().resolve().promise();
    };

    /**
     * Handles the reset of the individual article content.
     */
    const resetArticleContent = function(article) {

        const articleHeader = article.find(".subarticle-headercontent");
        articleHeader.show();

        return $.Deferred().resolve().promise();
    };

    /**
     * Resets the display of the main topic section to it's original content.
     */
    const resetTopicContent = function(topic) {

        const topicDetail = topic.find(".topic-detail");
        const topicHeader = topic.find(".topic-header");

        topicDetail.hide().html(topicDetail.data("originalcontent")).fadeIn("slow");
        topicHeader.hide().html(topicHeader.data("originalcontent")).fadeIn("slow");

        return $.Deferred().resolve().promise();
    };

    /**
     * Returns true if any article is currently transitioning
     */
    const isAnyArticleTransitioning = () => (
        $("." + ARTICLE_STATE_HIGHLIGHTING).length > 0 ||
        $("." + ARTICLE_STATE_UNHIGHLIGHTING).length > 0
    );

    /**
     * Handles the show/hide animation of each topic article.
     */
    const handleToggleArticle = function(article, pipelined) {

        // If anyone is mid transition, ignore the click?
        if (isAnyArticleTransitioning()) {
            return $.Deferred().resolve().promise();
        }

        // Elements 
        const topic = article.parents(".topic");
        const hoverContent = article.find(".subarticle-hovercontent");
        const captionContent = article.find(".subarticle-caption")
        hoverContent.hide();
        captionContent.hide();

        const currentHighlightedArticle = $("." + ARTICLE_STATE_HIGHLIGHTED);

        // Not highlighed, transition to highlighted
        if (!article.hasClass(ARTICLE_STATE_HIGHLIGHTED)) {

            // If another article is already highlighed, transition it out first
            if (currentHighlightedArticle.length > 0) {
                return (
                    handleToggleArticle(currentHighlightedArticle, true)
                        .then(() => {
                            return handleToggleArticle(article);
                        })
                );
            }

            article.addClass(ARTICLE_STATE_HIGHLIGHTING);

            article.data("startPosition", {
                top: article.position().top + "px", left: article.position().left + "px"
            });
            article.data("startBoxDimensions", {
                width: article.width() + "px", height: article.height() + "px"
            });

            const targetPosition = {top: '-345px',  left: '380px'};
            const targetBoxDimensions = {width: '464px', height: '306px'};

            const articleHeader = article.find(".subarticle-headercontent");
            articleHeader.hide();

            const setFinishedState = () => {
                article
                    .removeClass(ARTICLE_STATE_HIGHLIGHTING)
                    .addClass(ARTICLE_STATE_HIGHLIGHTED);
                return $.Deferred().resolve().promise();
            };
            const animatePosition = () => {
                return article.animate(targetPosition, ARTICLE_STATE_HIGHLIGHT_DURATION).promise()
            };
            const animateDimensions = () => {
                return article.animate(targetBoxDimensions, ARTICLE_STATE_HIGHLIGHT_DURATION).promise();
            };
            const transitionContent = () => {
                return showArticleContent(article);
            };
            
            return (
                animatePosition()
                    .then(animateDimensions)
                    .then(transitionContent)
                    .then(setFinishedState)
            );
        }
        else if (article.hasClass(ARTICLE_STATE_HIGHLIGHTED)) {

            article.addClass(ARTICLE_STATE_UNHIGHLIGHTING);

            const targetPosition = article.data("startPosition");
            const targetBoxDimensions = article.data("startBoxDimensions");

            const setFinishedState = () => {
                article
                    .removeClass(ARTICLE_STATE_UNHIGHLIGHTING)
                    .removeClass(ARTICLE_STATE_HIGHLIGHTED);
                return $.Deferred().resolve().promise();
            };
            const animatePosition = () => {
                return article.animate(targetPosition, ARTICLE_STATE_UNHIGHLIGHT_DURATION).promise()
            };
            const animateDimensions = () => {
                return article.animate(targetBoxDimensions, ARTICLE_STATE_UNHIGHLIGHT_DURATION).promise();
            };
            const transitionContent = () => {
                if (pipelined) {
                    return resetArticleContent(article);
                }
                return resetArticleContent(article).then(() => {
                    return resetTopicContent(topic);
                });
            };

            return (
                    animateDimensions()
                    .then(animatePosition)
                    .then(transitionContent)
                    .then(setFinishedState)
            );
        }
        return $.Deferred().resolve().promise();
    };

    /**
     * Handle what happens when an article is hovered over. Handle both the 
     * small and highlighted scenarios.
     */
    const handleArticleHoverOver = function() {

        if (isAnyArticleTransitioning()) {
            return;
        }

        const article = $(this);
        const highlighted = article.hasClass(ARTICLE_STATE_HIGHLIGHTED);
        if (!highlighted) {
            article.find(".subarticle-hovercontent").fadeIn();
        }
        else {
            article.find(".subarticle-caption").fadeIn();
        }
    };

    /**
     * Handle what happens when an article is hovered out. Handle both the small 
     * and highlighted scenarios.
     */
    const handleArticleHoverOut = function() {

        if (isAnyArticleTransitioning()) {
            return;
        }

        const article = $(this);
        const highlighted = article.hasClass(ARTICLE_STATE_HIGHLIGHTED);
        if (!highlighted) {
            article.find(".subarticle-hovercontent").fadeOut();
        }
        else {
            article.find(".subarticle-caption").fadeOut();
        }
    };

    /**
     * Bind all article functions.
     */
    const articles = $(".subarticle");
    articles.on("click", function() { handleToggleArticle($(this)); });
    articles.hover(handleArticleHoverOver, handleArticleHoverOut);

    /**
     * Constants for plunger animation and navigation.
     */
    const PLUNGER_DURATION = 2000;
    const PLUNGER_STATE_PLUNGING = "plunger-state-plunging";

    const plunger = $("#plungerPlunger");
    const plungerRod = $("#plungerRod");
    const plungerFilter = $("#plungerFilter");
    const plungerCoffee = $("#plungerCoffee");
    const plungerBubble1 = $("#plungerCoffeeBubble1");
    const plungerBubble2 = $("#plungerCoffeeBubble2");
    const plungerNav = $("#plungerNav");

    const plungerSteps = {
        "plantations": {height: "95px"},
        "roasting": {height: "195px"},
        "grinding": {height: "270px"},
        "preparation": {height: "340px"}
    };

    /**
     * Determines whether the plunger is currently animating.
     */
    const isPlungerPlunging = () => plunger.hasClass(PLUNGER_STATE_PLUNGING);

    /**
     * Handle main plunger animation.
     */
    const animatePlungerToStep = function(stepName) {

        const step = plungerSteps[stepName];
        plungerBubble1.addClass("plunger-coffee-bubble-end-1");
        plungerBubble2.addClass("plunger-coffee-bubble-end-2");

        plunger.addClass(PLUNGER_STATE_PLUNGING);

        return plungerRod.animate(step, PLUNGER_DURATION).promise().then( () => {
            plungerBubble1.removeClass("plunger-coffee-bubble-end-1");
            plungerBubble2.removeClass("plunger-coffee-bubble-end-2");
            plunger.removeClass(PLUNGER_STATE_PLUNGING);
        });
    };

    /**
     * Returns the currently visible topic
     */
    const findCurrentTopic = () => $("section.topic:visible");

    /**
     * Transitions between the current topic and the target topic
     */
    const transitionTopics = (current, target) => {
        current.fadeOut("slow").promise().then(() => target.fadeIn("slow"));
    };

    const topicNavButtons = $(".topic-navbutton");
    const plungerNavButtons = plungerNav.find("a[data-target]");

    const togglePlungerNav = (target) => {
        plungerNavButtons.removeClass("on");
        target.addClass("on");
    };

    /**
     * Handle navigation of the topic next/previous buttons
     */
    topicNavButtons.on("click", function(e) {

        const button = $(this);
        const topic = button.parents("section");
        const targetId = button.data("target");
        const target = $("#" + targetId);
        const plungerButton = plungerNav.find('*[data-target="' + targetId + '"]');

        togglePlungerNav(plungerButton);
        animatePlungerToStep(targetId);
        transitionTopics(topic, target);

    });

    /**
     * Handle navigation of the plunger navigation options
     */
    
    plungerNavButtons.on("click", function(e) {

        const button = $(this);
        const topic = findCurrentTopic();
        const targetId = button.data("target");
        const target = $("#" + targetId);
        const alreadySelected = button.hasClass("on");

        if (!alreadySelected) {
            togglePlungerNav(button);
            animatePlungerToStep(targetId);
            transitionTopics(topic, target);
        }

    });

});