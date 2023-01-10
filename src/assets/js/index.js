/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */


//SET UP THE JPLAYER
$("#jquery_jplayer_1").jPlayer({
    ready: function () {
        $(this).jPlayer("setMedia", {
            title   : "Relaxation Resource Binaural Technology",
            m4a     : "audio/R01_Beth_wBeats.mp3"
        });
        app.log("jplayer loaded");

    },
    cssSelectorAncestor : "#jp_container_1",
    swfPath             : "/js",
    supplied            : "m4a, oga",
    useStateClassSkin   : true,
    autoBlur            : false,
    smoothPlayBar       : true,
    keyEnabled          : true,
    remainingDuration   : true,
    toggleDuration      : true
});

//ADD EVENTS TO THE PLAY AND PAUSE BUTTON
$("#jquery_jplayer_1").bind($.jPlayer.event.play, function(event) {
    // Add a listener to report the time play began
    app.log("play start! : current playtime " + app.cache.sessionPlayTime);
    app.startTimer();
    // window.plugins.insomnia.keepAwake();
});

$("#jquery_jplayer_1").bind($.jPlayer.event.pause, function(event) {
    // Add a listener to handle pausing
    app.log("play pause! : current playtime " + app.cache.sessionPlayTime);
    app.stopTimer();
});

$("#jquery_jplayer_1").bind($.jPlayer.event.ended, function(event) {
    // Add a listener to handle reaching the end
    $(".logit").click();
});

$(".jp-play").click(function(){
    $(this).toggleClass("pause");
});

$(".jp-stop").click(function(){
    $(".jp-play").removeClass("pause");
});

