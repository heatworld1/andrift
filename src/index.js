console.clear();

((win, doc) => {
    "use strict";

    let dropArea = doc.getElementById("dropForm"),
        imageLimit = 1048576,
        linearSpeed = 15,
        circularSpeed = 15,
        playSpeed = 30,
        is3D = false,
        mvInterval,
        image_list = [],
        stage = doc.getElementById("canvas"),
        ctx = stage.getContext("2d"),
        recordMode = false,
        userPoints = [],
        blendValues = [
            "source-over",
            "source-in",
            "source-out",
            "source-atop",
            "destination-over",
            "destination-in",
            "destination-out",
            "destination-atop",
            "lighter",
            "copy",
            "xor",
            "multiply",
            "screen",
            "overlay",
            "darken",
            "lighten",
            "color-dodge",
            "color-burn",
            "hard-light",
            "soft-light",
            "difference",
            "exclusion",
            "hue",
            "saturation",
            "color",
            "luminosity"
        ].sort(),
        canvasSettings = {
            motion: false,
            border: 0,
            movement: false,
            size: 1,
            flipX: false,
            flipY: false,
            opacity: 1,
            height: 1200,
            width: 900,
            color: "#ffffff",
            settings: [
                {
                    type: "button",
                    label: "Record Movement",
                    id: "recordMovement",
                    value: false,
                    name: "record_movement"
                },
                {
                    type: "button",
                    label: "3D Movement",
                    id: "3dMovement",
                    value: false,
                    name: "3d_movement"
                },
                {
                    type: "button",
                    label: "Play Movement",
                    id: "playMovement",
                    value: false,
                    name: "play_movement"
                },
                {
                    type: "button",
                    label: "Flip Canvas Horizontal",
                    id: "flipButtonHorizontal",
                    value: false,
                    name: "flip_button_horizontal"
                },
                {
                    type: "button",
                    label: "Flip Canvas Vertical",
                    id: "flipButtonVertical",
                    value: false,
                    name: "flip_button_vertical"
                },
                {
                    type: "button",
                    label: "View Full Screen",
                    id: "fullScreenButton",
                    value: false,
                    name: "full_screen_button"
                },
                {
                    type: "dropdown",
                    label: "Movement",
                    id: "canvasMovement",
                    value: "",
                    values: [
                        "Circular Clockwise",
                        "Circular Counter Clockwise",
                        "Horizontal",
                        "Vertical"
                    ],
                    name: "canvas_movement"
                },
                {
                    type: "slider",
                    label: "Canvas Opacity",
                    id: "opacitySlider",
                    value: 1,
                    step: 0.1,
                    min: 0,
                    max: 1,
                    name: "opacity_slider"
                },
                {
                    type: "slider",
                    label: "Canvas Border",
                    id: "borderSlider",
                    value: 0,
                    step: 1,
                    min: 0,
                    max: 10,
                    name: "border_slider"
                },
                {
                    type: "slider",
                    label: "Canvas Size",
                    id: "canvasSizeSlider",
                    value: 1,
                    step: 0.1,
                    min: 0.1,
                    max: 2,
                    name: "canvas_size_slider"
                }
            ]
        },
        moving = false,
        pointer_initial = {
            x: 0,
            y: 0
        },
        pointer = {
            x: 0,
            y: 0
        },
        motion_initial = {
            x: null,
            y: null
        },
        motion = {
            x: 0,
            y: 0
        },
        editSettings = [
            {
                type: "slider",
                label: "Skew X",
                id: "",
                value: 0,
                name: "skew.x",
                step: 0.1,
                min: -1,
                max: 1,
                showLabel: false
            },
            {
                type: "slider",
                label: "Skew Y",
                id: "",
                value: 0,
                name: "skew.y",
                step: 0.1,
                min: -1,
                max: 1,
                showLabel: false
            },
            {
                type: "slider",
                label: "Location X",
                id: "",
                value: 0,
                name: "location.x",
                step: 10,
                min: -2000,
                max: 2000,
                showLabel: false
            },
            {
                type: "slider",
                label: "Location Y",
                id: "",
                value: 0,
                name: "location.y",
                step: 10,
                min: -2000,
                max: 2000,
                showLabel: false
            },
            {
                type: "slider",
                label: "Z Index",
                id: "",
                value: 1,
                name: "zIndex",
                step: 0.1,
                min: -3,
                max: 3,
                showLabel: false
            },
            {
                type: "slider",
                label: "Opacity",
                id: "",
                value: 1,
                name: "opacity",
                step: 0.1,
                min: 0,
                max: 1,
                showLabel: false
            },
            {
                type: "slider",
                label: "Scale",
                id: "",
                value: 1,
                name: "scale",
                step: 0.1,
                min: 0,
                max: 2,
                showLabel: false
            },
            {
                type: "slider",
                label: "Blur",
                id: "",
                value: 0,
                name: "blur",
                step: 1,
                min: 0,
                max: 20,
                showLabel: false
            },
            {
                type: "slider",
                label: "Shadow",
                id: "",
                value: 0,
                name: "shadow",
                shadowType: {
                    one: 0,
                    two: 0,
                    three: 0
                },
                step: 1,
                min: -10,
                max: 10,
                showLabel: false
            },
            {
                type: "dropdown",
                label: "Blend Mode",
                id: "",
                value: "",
                name: "blend",
                values: blendValues
            }
            // {
            //   type: "dropdown",
            //   label: "Filters",
            //   id: "",
            //   value: "",
            //   name: "androidFilter",
            //   values: [],
            //   android: {
            //     filter: ""
            //   }
            // }
        ];

    if (isDesktop()) {
        editSettings.push({
            type: "slider",
            label: "Distance",
            id: "",
            value: 0.3,
            name: "touch_multiplier",
            step: 0.1,
            min: 0.3,
            max: 1.3,
            showLabel: false
        });
    } else {
        canvasSettings.settings.push({
            type: "button",
            label: "Enable Motion",
            id: "motionButton",
            value: false,
            name: "motion_button"
        });

        editSettings.push({
            type: "slider",
            label: "Distance",
            id: "",
            value: 2.5,
            name: "motion_multiplier",
            step: 0.1,
            min: 2.5,
            max: 3.5,
            showLabel: false
        });
    }

    if (doc.readyState === "complete") {
        DOMLoaded();
    } else {
        win.addEventListener("DOMContentLoaded", DOMLoaded);
    }

    function DOMLoaded() {
        //LOADER CODE START///////////////////
        let loader = doc.getElementById("loader");

        //Hide loader
        setTimeout(() => {
            loader.style.opacity = 0;
        }, 1000);

        //Enable Clicks
        setTimeout(() => {
            loader.style.display = "none";
        }, 2000);
        //LOADER CODE END///////////////////

        //Copyright
        doc.querySelector(".copy-year").textContent = new Date().getFullYear();
        // END Copyright

        if (isMobile()) {
            setMobileClass(true, "mobile");
        }

        //Setup Event Listeners
        initListenters();

        //Settup Canvas Settings
        createCanvasSettings();

        //Icons
        feather.replace();
    }

    function setMobileClass(s, cls) {
        let b = doc.querySelector("body");

        if (s) {
            if (!b.classList.contains(cls)) {
                b.classList.add(cls);
            }
        } else {
            b.classList.remove(cls);
        }
    }

    function isMobile() {
        let width = win.innerWidth;

        return width <= 768;
    }

    function isDesktop() {
        let $ret = false;

        if (
            !/Android|webOS|iPhone|iPad|Mac|Macintosh|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
                navigator.userAgent
            )
        ) {
            $ret = true;
        }

        return $ret;
    }

    function initListenters() {
        //*********RESIZE BEGIN*********//
        win.onresize = function () {
            let width = win.innerWidth;

            setMobileClass(width <= 768, "mobile");
        };
        //*********RESIZE END*********//

        //*********PAGE BEGIN*********//
        win.addEventListener("click", function (evt) {
            let found = false;

            for (let i = 0; i < evt.path.length; i++) {
                if (
                    evt.path[i].tagName &&
                    (evt.path[i].tagName.toLowerCase() === "nav" ||
                        evt.path[i].tagName.toLowerCase() === "aside")
                ) {
                    found = true;

                    break;
                }
            }

            if (found) {
                return false;
            }

            //Hide whats open
            if (doc.querySelector("aside.shown") && isMobile()) {
                let anc = doc.querySelector("aside.shown"),
                    eventClick = new Event("click"),
                    headerNewIcon = doc.getElementsByName(anc.id)[0];

                headerNewIcon.dispatchEvent(eventClick);
            }
        });
        //*********PAGE END*********//

        //*********NAV BEGIN*********//
        doc.querySelectorAll("nav a").forEach((e) => {
            let el = e,
                name = el.name;

            el.addEventListener("click", (ev) => {
                ev.preventDefault();

                if (!image_list.length) {
                    shake(doc.querySelector("#dropForm label"));

                    return false;
                }

                let side = doc.getElementById(name);

                //Close open sections and clear active classes
                doc.querySelectorAll("header a.active").forEach((e) => {
                    if (e.name !== name) {
                        e.classList.remove("active");
                    }
                });
                doc.querySelectorAll("aside.shown").forEach((e) => {
                    if (name !== e.id) {
                        e.classList.remove("shown");
                    }
                });

                if (el && side) {
                    let isOpen =
                        el.classList.contains("active") && side.classList.contains("shown");

                    el.classList.toggle("active", !isOpen);
                    side.classList.toggle("shown", !isOpen);
                }
            });
        });
        //*********NAV END*********//

        //*********UPLOAD BEGIN*********//
        ["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
            dropArea.addEventListener(eventName, preventDefaults, false);
            doc.body.addEventListener(eventName, preventDefaults, false);
        });
        ["dragenter", "dragover"].forEach((eventName) => {
            dropArea.addEventListener(
                eventName,
                () => dropArea.parentNode.classList.add("highlight"),
                false
            );
        });
        ["dragleave", "drop"].forEach((eventName) => {
            dropArea.addEventListener(
                eventName,
                () => dropArea.parentNode.classList.remove("highlight"),
                false
            );
        });

        doc
            .getElementById("fileElem")
            .addEventListener("change", handleDrop, false);
        dropArea.addEventListener("drop", handleDrop, false);
        //*********UPLOAD END*********//

        //*********GALLERY BEGIN*********//
        listen("click", "#gallery .add-image-btn", (event, target) => {
            event.preventDefault();

            doc.getElementById("appendPhotoEl").click();
        });
        doc
            .getElementById("appendPhotoEl")
            .addEventListener("change", handleDrop, false);
        dropArea.addEventListener("drop", handleDrop, false);

        ["click", "touchstart"].forEach((trig) => {
            listen(trig, "#gallery .erase-btn", (event, target) => {
                event.preventDefault();

                let id = target.parentNode
                    .querySelector(".stage-img")
                    .getAttribute("data-id");

                image_list = image_list.filter((img) => img.id !== parseInt(id));

                target.parentNode.remove(target);

                renumberGallery();
            });
        });
        listen("click", "#gallery .reset-btn", (event, target) => {
            event.preventDefault();

            image_list.length = 0;

            doc
                .querySelectorAll(".gallery-imgs .img-container")
                .forEach(function (el) {
                    el.remove();
                });

            showSection("dropArea");
        });
        listen("click", "#gallery .upload-btn", (event, target) => {
            event.preventDefault();

            createScene();
        });
        //*********GALLERY END*********//

        //*********CANVAS START*********//
        ["mousedown", "touchstart"].forEach((ev) => {
            doc.querySelector("#canvasContainer").addEventListener(ev, (event) => {
                moving = true;

                let cli = getClient(event);

                pointer_initial.x = cli.x;
                pointer_initial.y = cli.y;
            });
        });
        ["mousemove", "touchmove"].forEach((ev) => {
            doc.querySelector("#canvasContainer").addEventListener(ev, (event) => {
                event.preventDefault();

                if (!moving) {
                    return false;
                }

                let cli = getClient(event);

                if (recordMode) {
                    userPoints.push({
                        x: cli.x - pointer_initial.x,
                        y: cli.y - pointer_initial.y
                    });
                }

                pointer.x = cli.x - pointer_initial.x;
                pointer.y = cli.y - pointer_initial.y;
            });
        });
        ["mouseup", "touchend"].forEach((ev) => {
            doc.querySelector("#canvasContainer").addEventListener(ev, (event) => {
                moving = false;
                TWEEN.removeAll();

                new TWEEN.Tween(pointer)
                    .to({ x: 0, y: 0 }, 1250)
                    .easing(TWEEN.Easing.Bounce.Out)
                    .start();
            });
        });
        //*********CANVAS END*********//

        //*********NEW MENU START*********//
        let close = doc.getElementById("newMenu").querySelector(".close-btn");
        close.addEventListener("click", (event) => {
            let eventClick = new Event("click"),
                headerNewIcon = doc.getElementsByName("newMenu")[0];

            headerNewIcon.dispatchEvent(eventClick);
        });

        let yes = doc.getElementById("newMenu").querySelector(".new-btn");
        yes.addEventListener("click", (event) => {
            let eventClick = new Event("click"),
                headerNewIcon = doc.getElementsByName("newMenu")[0];

            headerNewIcon.dispatchEvent(eventClick);
            doc.getElementById("layers").innerHTML = "";
            showSection("dropArea");
            image_list.length = 0;

            resetCanvasSettings();
        });
        //*********NEW MENU END*********//

        //*********CANVAS SETTINGS MENU START*********//
        //buttons
        listen("click", "#canvasMenu .canvas-settings input", (evt, target) => {
            evt.stopPropagation();

            if (target.type !== "checkbox") {
                return false;
            }

            //Flip canvas
            if (target.name === "flip_button_horizontal") {
                let val = canvasSettings.size,
                    x = target.checked ? -1 * val : val,
                    y = canvasSettings.flipY ? -1 * val : val;

                doc.getElementById("canvasContainer").style.transform =
                    "scale(" + x + "," + y + ")";
                canvasSettings.flipX = target.checked;
            }

            if (target.name === "flip_button_vertical") {
                let val = canvasSettings.size,
                    x = canvasSettings.flipX ? -1 * val : val,
                    y = target.checked ? -1 * val : val;

                doc.getElementById("canvasContainer").style.transform =
                    "scale(" + x + "," + y + ")";
                canvasSettings.flipY = target.checked;
            }

            //Enable mobile motion
            if (target.name === "motion_button") {
                if (typeof DeviceMotionEvent.requestPermission === "function") {
                    DeviceOrientationEvent.requestPermission()
                        .then((permissionState) => {
                            if (permissionState === "granted") {
                                target.checked = true;
                                canvasSettings.motion = true;
                            }
                        })
                        .catch(console.error);
                } else {
                    target.checked = !canvasSettings.motion;
                    canvasSettings.motion = !canvasSettings.motion;
                }

                //Reset
                if (!canvasSettings.motion) {
                    motion.x = 0;
                    motion.y = 0;
                    motion_initial.x = 0;
                    motion_initial.y = 0;
                }
            }

            //Full Screen
            if (target.name === "full_screen_button") {
                evt.preventDefault();

                let elem = doc.documentElement,
                    eventClick = new Event("click"),
                    headerNewIcon = doc.getElementsByName("canvasMenu")[0];

                headerNewIcon.dispatchEvent(eventClick);

                //Go full screen
                if (elem.requestFullscreen) {
                    elem.requestFullscreen();
                } else if (elem.webkitRequestFullscreen) {
                    /* Safari */
                    elem.webkitRequestFullscreen();
                } else if (elem.msRequestFullscreen) {
                    /* IE11 */
                    elem.msRequestFullscreen();
                }
            }

            //3D movement
            if (target.name === "3d_movement") {
                is3D = !is3D;
            }

            //Record
            if (target.name === "record_movement") {
                //Clear the points if we are not currently recording
                if (!recordMode) {
                    userPoints.length = 0;

                    //Play mode should be turned off
                    target
                        .closest(".canvas-settings")
                        .querySelector("#playMovement").checked = false;
                }

                //Set the flag
                recordMode = !recordMode;
            }

            //Play
            if (target.name === "play_movement") {
                recordMode = false;
                target
                    .closest(".canvas-settings")
                    .querySelector("#recordMovement").checked = false;

                userPoints.push({
                    x: 0,
                    y: 0
                });

                let cnt = 0;
                mvInterval = setInterval(function () {
                    if (userPoints[cnt]) {
                        pointer.x = userPoints[cnt].x;
                        pointer.y = userPoints[cnt].y;
                    }

                    if (cnt === userPoints.length) {
                        clearInterval(mvInterval);
                        target
                            .closest(".canvas-settings")
                            .querySelector("#playMovement").checked = false;
                    }

                    cnt++;
                }, playSpeed);
            }
        });
        //sliders
        listen("input", "#canvasMenu .canvas-settings input", (evt, target) => {
            evt.preventDefault();

            if (target.type !== "range") {
                return false;
            }

            if (target.id === "borderSlider") {
                doc.getElementById("canvasContainer").style.border =
                    target.value + "px solid black";
                canvasSettings.border = target.value;
            }

            if (target.id === "opacitySlider") {
                doc.getElementById("canvasContainer").style.opacity = target.value;
                canvasSettings.opacity = target.value;
            }

            if (target.id === "canvasSizeSlider") {
                let xVal = canvasSettings.flipX ? -1 * target.value : target.value,
                    yVal = canvasSettings.flipY ? -1 * target.value : target.value;

                doc.getElementById("canvasContainer").style.transform =
                    "scale(" + xVal + "," + yVal + ")";

                canvasSettings.size = target.value;
            }
        });
        //dropdowns
        listen("change", "#canvasMenu .canvas-settings select", (evt, target) => {
            evt.preventDefault();
            if (target.id === "canvasMovement") {
                canvasSettings.movement = target.value;

                //Reset Canvas Movement
                clearMovement();

                if (target.value.length) {
                    switch (target.value.toLowerCase()) {
                        case "circular clockwise":
                            circular();

                            break;
                        case "circular counter clockwise":
                            circular(true);

                            break;
                        case "horizontal":
                            move();

                            break;
                        case "vertical":
                            move(true);

                            break;
                        default:
                            break;
                    }
                }
            }
        });
        //*********CANVAS SETTINGS MENU END*********//

        //*********LAYERS MENU START*********//
        listen("click", "#layersMenu .actions .feather-trash", (event, target) => {
            event.preventDefault();

            if (!image_list.length) {
                return false;
            }

            let response = confirm("Are you sure you want to clear all the layers?");

            if (response) {
                doc.getElementById("layers").innerHTML = "";

                let eventClick = new Event("click");
                let headerNewIcon = doc.getElementsByName("layersMenu")[0];
                headerNewIcon.dispatchEvent(eventClick);

                image_list.length = 0;

                showSection("dropArea");
            }
        });

        doc.getElementById("addPhotoEl").addEventListener(
            "change",
            function (evt) {
                if (evt.type !== "change") {
                    return false;
                }

                let addedFiles = doc.getElementById("addPhotoEl").files,
                    cnt = doc.querySelectorAll("#layers .layer:not(.background)").length,
                    newFiles = [...addedFiles];

                new Promise((resolve, reject) => {
                    newFiles.forEach((file, i, arr) =>
                        previewFile(file, i, arr.length, resolve, reject, true)
                    );
                }).then(() => {
                    //Load up each image that isnt added yet
                    let brandNew = image_list.filter((x) => x.fresh);

                    brandNew.forEach((layer, ind) => {
                        layer.image.onload = (data) => {
                            let tar = data.currentTarget;

                            layer.height = tar.height;
                            layer.width = tar.width;
                            cnt++;

                            addLayerSetting(layer);

                            //We must unset the fresh flag
                            changeLayerInfo(layer.id, "fresh", false);

                            if (ind === brandNew.length - 1) {
                                addBgLayer();
                                renumberLayers();
                            }
                        };

                        layer.image.src = layer.src;
                    });

                    //Clear file input in layers
                    doc.getElementById("addPhotoEl").value = "";
                });
            },
            false
        );

        listen("click", ".layer .feather-sliders", (event, target) => {
            event.preventDefault();

            let id = target.closest(".layer").getAttribute("data-id"),
                layerName = target.closest(".layer").querySelector(".layer-name");

            //Change name to input
            if (!target.classList.contains("active")) {
                let nameInput = doc.createElement("input");
                nameInput.type = "text";
                nameInput.classList.add("input-name");
                nameInput.value = layerName.textContent.replace(/\..+$/, "");
                layerName.textContent = "";
                layerName.appendChild(nameInput);
            }

            //When we close the settings save the name and update the view
            if (target.classList.contains("active")) {
                let nm =
                    layerName.querySelector(".input-name").value.replace(/\..+$/, "") +
                    ".png";
                layerName.textContent = "";
                layerName.textContent = nm;

                changeLayerInfo(id, "name", nm);
            }

            target.classList.toggle("active");
            target
                .closest(".layer")
                .querySelector(".layer-settings")
                .classList.toggle("is-open");
        });
        listen("click", ".layer .feather-trash", (event, target) => {
            event.preventDefault();

            let id = target.closest(".layer").getAttribute("data-id"),
                response = confirm("Are you sure you want to delete this layer?");

            if (response) {
                if (image_list.length === 1) {
                    let eventClick = new Event("click");
                    let headerNewIcon = doc.getElementsByName("layersMenu")[0];
                    headerNewIcon.dispatchEvent(eventClick);
                }

                image_list = image_list.filter((i) => {
                    return i.id != id;
                });

                target.closest(".layer").remove();

                if (image_list.length === 0) {
                    showSection("dropArea");
                } else {
                    renumberLayers();
                }
            }
        });
        listen("input", ".setting-row input", (event, target) => {
            event.preventDefault();

            let layer = target.closest(".layer");
            let id = parseInt(layer.getAttribute("data-id"));

            //Slider
            if (target.type === "range") {
                let settingValue = target
                    .closest(".setting-row")
                    .querySelector(".value");
                let img = image_list.filter((x) => x.id === id)[0];

                if (img.showLabel) {
                    settingValue.textContent = Math.floor(Number(target.value) * 100);
                }

                let nameArr = target.name.split(".");

                if (nameArr.length === 2) {
                    img[nameArr[0]][nameArr[1]] = Number(target.value);
                } else {
                    img[target.name] = Number(target.value);
                }
            }

            //Button
            if (target.type === "checkbox") {
            }
        });
        listen("change", ".setting-row select", (event, target) => {
            event.preventDefault();

            let layer = target.closest(".layer");
            let id = parseInt(layer.getAttribute("data-id"));
            let img = image_list.filter((x) => x.id === id)[0];

            img[target.name] = target.value;
        });
        listen("input", ".layer .img-sq input", (event, target) => {
            event.preventDefault();

            doc.querySelector("main").style.background = target.value;
        });
        //*********LAYERS MENU END*********//

        //*********GYRO ACCEL START*********//
        win.addEventListener("deviceorientation", (event) => {
            if (!canvasSettings.motion) {
                return false;
            }

            if (!motion_initial.x && !motion_initial.y) {
                motion_initial.x = event.beta;
                motion_initial.y = event.gamma;
            }

            switch (win.orientation) {
                //Portrait
                case 0:
                    motion.x = event.gamma - motion_initial.y;
                    motion.y = event.beta - motion_initial.x;

                    break;

                //Other Portrait
                case 180:
                    motion.x = -event.gamma + motion_initial.y;
                    motion.y = -event.beta + motion_initial.x;

                    break;
                //landscape
                case 90:
                    motion.x = event.beta - motion_initial.x;
                    motion.y = -event.gamma + motion_initial.y;

                    break;
                //Other Landscape
                case -90:
                    motion.x = -event.beta + motion_initial.x;
                    motion.y = event.gamma - motion_initial.y;

                    break;
                default:
                    motion.x = -event.gamma + motion_initial.y;
                    motion.y = -event.beta + motion_initial.x;

                    break;
            }

            let max_offset = 23;

            if (Math.abs(motion.x) > max_offset) {
                // Check whether offset is positive or negative, and make sure to keep it that way
                if (motion.x < 0) {
                    motion.x = -max_offset;
                } else {
                    motion.x = max_offset;
                }
            }
            // Check if magnitude of motion offset along Y axis is greater than your max setting
            if (Math.abs(motion.y) > max_offset) {
                // Check whether offset is positive or negative, and make sure to keep it that way
                if (motion.y < 0) {
                    motion.y = -max_offset;
                } else {
                    motion.y = max_offset;
                }
            }
        });
        // Reset the position of motion controls when device changes between portrait and landscape, etc.
        win.addEventListener("orientationchange", (event) => {
            if (true) {
                return false;
            }

            motion_initial.x = 0;
            motion_initial.y = 0;
        });
        //*********GYRO ACCEL END*********//

        //=============== Layer Menu Sorting =================
        let layersDiv = doc.getElementById("layers");

        Sortable.create(layersDiv, {
            handle: isDesktop() ? ".layer .default-layer" : ".drag-handle",
            filter: ".fixed-el",
            onMove: (event) => {
                return !event.related.classList.contains("fixed-el");
            },
            onEnd: (evt) => {
                renumberLayers();
            }
        });
        //=============== END Layer Menu Sorting =================

        //======== Gallery Preview Sorting =====
        let gl = doc.querySelector(".gallery-imgs");

        Sortable.create(gl, {
            handle: ".img-container",
            filter: ".fixed-el",
            onMove: (event) => {
                return !event.related.classList.contains("fixed-el");
            },
            onEnd: (evt) => {
                renumberGallery();
            }
        });
        /// ====== END GALLERY SORT========
    }

    function listen(type, selector, callback) {
        doc.addEventListener(type, (event) => {
            const target = event.target.closest(selector);

            if (target) {
                callback(event, target);
            }
        });
    }

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    function renumberGallery() {
        let galleryPhotos = doc.querySelectorAll(".gallery-imgs .img-container");

        for (let j = 0; j < galleryPhotos.length; j++) {
            //set page order attribute to be correct
            galleryPhotos[j].querySelector("img").setAttribute("data-order", j);

            //Set the order id of the current data-id
            changeLayerInfo(
                galleryPhotos[j].querySelector("img").getAttribute("data-id"),
                "order",
                j
            );
        }
    }

    function renumberLayers() {
        let layers = doc.querySelectorAll("#layers .layer:not(.background)");

        layers.forEach((layer, ind) => {
            layer.querySelector(".layer-num").textContent = layers.length - ind + ".";

            changeLayerInfo(layer.getAttribute("data-id"), "order", ind);
        });
    }

    function changeLayerInfo(id, property, value) {
        for (let i in image_list) {
            if (image_list[i].id == id) {
                image_list[i][property] = value;

                break;
            }
        }
    }

    function handleDrop(e) {
        let data;

        if (e.type === "change") {
            data = doc.getElementById(e.target.id);
        } else {
            data = e.dataTransfer;
        }

        handleFiles(data.files);
        doc.getElementById(e.target.id).value = "";
    }

    function handleFiles(files) {
        let newFiles = [...files];

        new Promise((resolve, reject) => {
            newFiles.forEach((file, i, arr) =>
                previewFile(file, i, arr.length, resolve, reject)
            );
        }).then(() => {
            showGallery();
        });
    }

    function previewFile(file, index, maxSize, res, rej, fresh) {
        //Only pngs
        if (file.type !== "image/png") {
            alert("The image " + file.name + " is not a png.");

            if (index === maxSize - 1) {
                res();
            }

            return false;
        }

        //Must be 1mb or smaller
        if (file.size > imageLimit) {
            alert(
                "The image " + file.name + " is too big. It must be smaller then 1mb."
            );

            if (index === maxSize - 1) {
                res();
            }

            return false;
        }

        let reader = new FileReader();

        reader.readAsDataURL(file);
        reader.onloadend = () => {
            let img = doc.createElement("img"),
                z = parseFloat((Math.random() * 2).toFixed(1));
            z *= Math.round(Math.random()) ? 1 : -1;

            img.src = reader.result;

            image_list.push({
                id: Math.floor(Math.random() * Date.now()),
                name: file.name,
                image: img,
                src: img.src,
                size: img.src.length,
                touch_multiplier: 0.3,
                motion_multiplier: 2.5,
                zIndex: z,
                location: { x: 0, y: 0 },
                translate: { x: 0, y: 0 },
                blend: null,
                order:
                    index + doc.querySelectorAll(".gallery-imgs .img-container").length,
                opacity: 1,
                scale: 1,
                height: 0,
                width: 0,
                shadow: false,
                blur: 0,
                skew: { x: 0, y: 0 },
                fresh: fresh ? true : false
            });

            if (index === maxSize - 1) {
                res();
            }
        };
    }

    function showGallery() {
        if (!image_list.length) {
            return false;
        }

        let gallery = doc.getElementById("gallery");

        //Clean
        gallery.querySelector(".gallery-imgs").innerHTML = "";
        doc.querySelector("#fileElem").value = "";

        image_list.forEach((img, index) => {
            const div = doc.createElement("div");
            div.classList.add("img-container");

            const i = doc.createElement("i");
            i.setAttribute("data-feather", "x");
            const eraseCont = doc.createElement("span");
            eraseCont.classList.add("erase-container");
            eraseCont.classList.add("erase-btn");
            eraseCont.appendChild(i);
            div.appendChild(eraseCont);

            const image = doc.createElement("img");
            image.classList.add("stage-img");
            image.setAttribute("data-size", img.size);
            image.setAttribute("data-order", img.order);
            image.setAttribute("data-id", img.id);
            image.title = img.name;
            image.src = img.src;
            div.appendChild(image);

            gallery.querySelector(".gallery-imgs").appendChild(div);
        });

        let elem = doc.querySelector(".add-image-btn");

        if (elem) {
            elem.parentNode.removeChild(elem);
        }

        let btn = doc.createElement("div");
        btn.classList.add("add-image-btn");
        btn.classList.add("fixed-el");

        let icon = doc.createElement("i");
        icon.setAttribute("data-feather", "plus");
        btn.appendChild(icon);

        gallery.querySelector(".gallery-imgs").appendChild(btn);

        feather.replace();

        showSection("gallery");
    }

    function showSection(sect) {
        let drop = doc.getElementById("dropArea"),
            gal = doc.getElementById("gallery"),
            can = doc.getElementById("canvasContainer");

        clearMovement();

        [drop, gal, can].forEach((el) => {
            el.classList.add("hidden");
        });

        if (doc.getElementById(sect)) {
            doc.getElementById(sect).classList.remove("hidden");
            doc.querySelector("main").style.background = "#ffffff";
        }
    }

    function createScene() {
        let cnter = 0;

        cleanSettings();

        new Promise((resolve, reject) => {
            image_list
                .sort((a, b) => (a.order > b.order ? 1 : -1))
                .forEach((layer, index) => {
                    layer.image.onload = (data) => {
                        let tar = data.currentTarget;

                        layer.height = tar.height;
                        layer.width = tar.width;
                        cnter++;

                        //Create layer setting
                        addLayerSetting(layer);

                        if (cnter >= image_list.length) {
                            requestAnimationFrame(pasteImage);
                        }

                        if (index === image_list.length - 1) {
                            resolve();
                        }
                    };

                    layer.image.src = layer.src;
                });
        }).then(() => {
            let largestWidth = 0,
                largestHeight = 0;

            for (let i = 0; i < image_list.length; i++) {
                let curr_img = image_list[i];

                if (curr_img.height > largestHeight) {
                    largestHeight = curr_img.height;
                }

                if (curr_img.width > largestWidth) {
                    largestWidth = curr_img.width;
                }
            }

            console.log(largestWidth, largestHeight);
            stage.height = largestHeight; //canvasSettings.height;
            stage.width = largestWidth; //canvasSettings.width;

            addBgLayer();

            renumberLayers();

            //Clean gallery
            doc.querySelector(".gallery-imgs").innerHTML = "";

            showSection("canvasContainer");
        });
    }

    function pasteImage() {
        ctx.clearRect(0, 0, stage.width, stage.height);
        TWEEN.update();

        let rotate_x = pointer.y * -0.15 + motion.y * 1.2,
            rotate_y = pointer.x * 0.15 + motion.x * 1.2;

        if (is3D) {
            stage.style.transform =
                "rotateX(" + rotate_x + "deg) rotateY(" + rotate_y + "deg)";
        }

        image_list
            .sort((a, b) => (a.order < b.order ? 1 : -1))
            .forEach((layer, index) => {
                if (is3D) {
                    layer.position = getImageOffset(layer);
                } else {
                    layer.position = get2DOffset(layer);
                }

                ctx.save();

                //Begin Image Edit
                ctx.globalCompositeOperation = layer.blend ? layer.blend : "normal";
                ctx.globalAlpha = layer.opacity;

                ctx.imageSmoothingEnabled = true;
                ctx.imageSmoothingQuality = "high";

                if (layer.shadow) {
                    ctx.shadowOffsetX = layer.shadow;
                    ctx.shadowOffsetY = layer.shadow;
                    ctx.shadowBlur = layer.shadow;
                    ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
                }

                if (layer.location.x || layer.location.y) {
                    ctx.translate(layer.location.x, layer.location.y);
                }

                if (layer.blur) {
                    ctx.filter = "blur(" + layer.blur + "px)";
                }

                if (layer.skew.x || layer.skew.y) {
                    ctx.transform(1, layer.skew.x, layer.skew.y, 1, 0, 0);
                }

                //cemter image but loses effect
                // ctx.drawImage(
                //   layer.image,
                //   canvasSettings.width / 2 - layer.width / 2,
                //   canvasSettings.height / 2 - layer.height / 2,
                //   layer.width * layer.scale,
                //   layer.height * layer.scale
                // );

                ctx.drawImage(
                    layer.image,
                    layer.position.x,
                    layer.position.y,
                    layer.width * layer.scale,
                    layer.height * layer.scale
                );

                //End Image Edit
                ctx.restore();
            });

        requestAnimationFrame(pasteImage);
    }

    function get2DOffset(img) {
        let touch_offset_x = pointer.x * img.zIndex,
            touch_offset_y = pointer.y * img.zIndex,
            motion_offset_x = motion.x * img.zIndex,
            motion_offset_y = motion.y * img.zIndex;

        return {
            x: (touch_offset_x + motion_offset_x) * 0.1,
            y: (touch_offset_y + motion_offset_y) * 0.1
        };
    }

    function getImageOffset(img) {
        let touch_multiplier = img.touch_multiplier,
            motion_multiplier = img.motion_multiplier,
            touch_offset_x = pointer.x * img.zIndex * touch_multiplier,
            touch_offset_y = pointer.y * img.zIndex * touch_multiplier,
            motion_offset_x = motion.x * img.zIndex * motion_multiplier,
            motion_offset_y = motion.y * img.zIndex * motion_multiplier;

        touch_offset_x = pointer.x * img.zIndex;
        touch_offset_y = pointer.y * img.zIndex;
        motion_offset_x = motion.x * img.zIndex;
        motion_offset_y = motion.y * img.zIndex;

        return {
            x: touch_offset_x + motion_offset_x,
            y: touch_offset_y + motion_offset_y
        };
    }

    function addBgLayer() {
        let l = doc.getElementById("layers");

        //Remove div
        if (doc.querySelector(".layer.background")) {
            doc.querySelector(".layer.background").remove();
        }

        //====== BACKGROUND ==-=======
        let inputColor = doc.createElement("input");
        inputColor.type = "color";
        inputColor.value = "#FFFFFF";

        let imgSpan = doc.createElement("span");
        imgSpan.classList.add("img-sq");
        imgSpan.appendChild(inputColor);

        let bgTextSpan = doc.createElement("span");
        bgTextSpan.textContent = "Base Color";

        let layerInfDiv = doc.createElement("div");
        layerInfDiv.classList.add("layer-info");
        layerInfDiv.appendChild(imgSpan);
        layerInfDiv.appendChild(bgTextSpan);

        let defLayerDiv = doc.createElement("div");
        defLayerDiv.classList.add("default-layer");
        defLayerDiv.appendChild(layerInfDiv);

        let layerBgDiv = doc.createElement("div");
        layerBgDiv.classList.add("layer");
        layerBgDiv.classList.add("background");
        layerBgDiv.classList.add("fixed-el");
        layerBgDiv.appendChild(defLayerDiv);

        //====== END BACKGROUND ======

        l.appendChild(layerBgDiv);
    }

    function addLayerSetting(layer) {
        let l = doc.getElementById("layers"),
            layerDiv = doc.createElement("div");

        layerDiv.classList.add("layer");
        layerDiv.setAttribute("data-id", layer.id);

        let imgSpan = doc.createElement("span");
        imgSpan.classList.add("img-sq");
        imgSpan.style.backgroundImage = "url(" + layer.src + ")";
        let numSpan = doc.createElement("span");
        numSpan.classList.add("layer-num");

        let nameSpan = doc.createElement("span");
        nameSpan.classList.add("layer-name");
        nameSpan.title = layer.name;
        nameSpan.textContent = layer.name;

        let layerInfo = doc.createElement("div");
        layerInfo.classList.add("layer-info");
        layerInfo.appendChild(imgSpan);
        layerInfo.appendChild(numSpan);
        layerInfo.appendChild(nameSpan);

        let settingSpan = doc.createElement("span");
        settingSpan.classList.add("icon-container");
        let settingIcon = doc.createElement("i");
        settingIcon.setAttribute("data-feather", "sliders");
        settingIcon.setAttribute("data-id", layer.id);
        settingSpan.appendChild(settingIcon);

        let trashSpan = doc.createElement("span");
        trashSpan.classList.add("icon-container");
        let trashIcon = doc.createElement("i");
        trashIcon.setAttribute("data-feather", "trash");
        trashSpan.appendChild(trashIcon);

        let moveSpan = doc.createElement("span");
        moveSpan.classList.add("icon-container");
        let moveIcon = doc.createElement("i");
        moveIcon.setAttribute("data-feather", "menu");
        moveIcon.classList.add("drag-handle");
        moveIcon.setAttribute("data-id", layer.id);
        moveSpan.appendChild(moveIcon);

        let defaultDiv = doc.createElement("div");
        defaultDiv.classList.add("default-layer");
        defaultDiv.appendChild(moveSpan);
        defaultDiv.appendChild(layerInfo);
        defaultDiv.appendChild(settingSpan);
        defaultDiv.appendChild(trashSpan);

        //-------- Setting --------------

        let settingDiv = doc.createElement("div");
        settingDiv.classList.add("layer-settings");

        editSettings
            .sort((a, b) => (a.label > b.label ? 1 : -1))
            .forEach((setting) => {
                let settingRow = "";

                switch (setting.type) {
                    case "slider":
                        settingRow = createSliderSetting(setting, layer);

                        break;
                    case "button":
                        settingRow = createButtonSetting(setting, layer);

                        break;
                    case "dropdown":
                        settingRow = createDropdownSetting(setting, layer);

                        break;
                    default:
                        settingRow = createSliderSetting(setting, layer);

                        break;
                }

                settingDiv.appendChild(settingRow);
            });
        //-------- END Setting-----------

        layerDiv.appendChild(defaultDiv);
        layerDiv.appendChild(settingDiv);

        if (layer.fresh) {
            l.insertBefore(layerDiv, l.firstChild);
        } else {
            l.appendChild(layerDiv);
        }

        feather.replace();
    }

    function createSliderSetting(setting, data) {
        let sliderDiv = doc.createElement("div");
        sliderDiv.classList.add("layer-slider");
        sliderDiv.textContent = setting.label;

        let valueDiv = doc.createElement("div");
        if (setting.showLabel) {
            valueDiv.classList.add("value");
            valueDiv.textContent = "MAX";
        }

        let settingTitle = doc.createElement("div");
        settingTitle.classList.add("setting-title");
        settingTitle.appendChild(sliderDiv);
        if (setting.showLabel) {
            settingTitle.appendChild(valueDiv);
        }

        let slider = doc.createElement("input");
        slider.name = setting.name;
        slider.type = "range";
        slider.classList.add("slider");
        slider.min = setting.min;
        slider.step = setting.step;
        slider.max = setting.max;

        switch (setting.name) {
            case "zIndex":
                slider.value = data.zIndex;

                break;
            default:
                slider.value = setting.value;

                break;
        }

        let barDiv = doc.createElement("div");
        barDiv.classList.add("bar");
        barDiv.appendChild(slider);

        let settingRow = doc.createElement("div");
        settingRow.classList.add("setting-row");
        settingRow.appendChild(settingTitle);
        settingRow.appendChild(barDiv);

        return settingRow;
    }

    function createButtonSetting(setting, data) {
        let label = doc.createElement("label");
        label.htmlFor = "";
        label.textContent = "";

        let button = doc.createElement("input");
        button.type = "checkbox";
        button.classLists.add();
        button.name = setting.name;
        button.id = "";

        let settingRow = doc.createElement("div");
        settingRow.classList.add("setting-row");
        settingRow.appendChild(label);
        settingRow.appendChild(button);

        return settingRow;
    }

    function createDropdownSetting(setting, data) {
        let label = doc.createElement("label");
        label.htmlFor = "";
        label.textContent = setting.label;

        let dropdown = doc.createElement("select");
        dropdown.id = setting.id;
        dropdown.value = setting.value;
        dropdown.name = setting.name;

        let defaultOpt = doc.createElement("option");
        defaultOpt.value = "";
        defaultOpt.textContent = "None";
        dropdown.appendChild(defaultOpt);

        setting.values.forEach((val) => {
            let opt = doc.createElement("option");
            opt.value = val;
            let spaced = val.replace(/-/g, " ");
            opt.innerHTML = toTitleCase(spaced);
            dropdown.appendChild(opt);
        });

        let settingTitle = doc.createElement("div");
        settingTitle.classList.add("setting-title");
        settingTitle.appendChild(label);
        settingTitle.appendChild(dropdown);

        let settingRow = doc.createElement("div");
        settingRow.classList.add("setting-row");
        settingRow.appendChild(settingTitle);

        return settingRow;
    }

    function createCanvasSettings() {
        let settings = doc.querySelector("#canvasMenu .canvas-settings");

        canvasSettings.settings
            .sort((a, b) => (a.label > b.label ? 1 : -1))
            .forEach(function (setting) {
                let setDiv = doc.createElement("div");
                setDiv.classList.add("canvas-setting");
                setDiv.classList.add(setting.type + "-setting");

                //Slider vs button
                if (setting.type === "button") {
                    let label = doc.createElement("label");
                    label.textContent = setting.label;
                    label.htmlFor = setting.id;

                    let checkInput = doc.createElement("input");
                    checkInput.type = "checkbox";
                    checkInput.classList.add("mobile-motion-btn");
                    checkInput.name = setting.name;
                    checkInput.id = setting.id;

                    setDiv.appendChild(label);
                    setDiv.appendChild(checkInput);
                }

                if (setting.type === "slider") {
                    let setLab = doc.createElement("label");
                    setLab.textContent = setting.label;
                    setLab.htmlFor = setting.id;
                    let setVal = doc.createElement("div");
                    setVal.textContent = "";
                    let setTitle = doc.createElement("div");
                    setTitle.classList.add("setting-title");
                    setTitle.appendChild(setLab);
                    setTitle.appendChild(setVal);

                    let rang = doc.createElement("input");
                    rang.id = setting.id;
                    rang.type = "range";
                    rang.classList.add("slider");
                    rang.min = setting.min;
                    rang.step = setting.step;
                    rang.max = setting.max;
                    rang.value = setting.value;
                    let bar = doc.createElement("div");
                    bar.classList.add("bar");
                    bar.appendChild(rang);

                    setDiv.appendChild(setTitle);
                    setDiv.appendChild(bar);
                }

                if (setting.type === "dropdown") {
                    let label = doc.createElement("label");
                    label.textContent = setting.label;
                    label.htmlFor = setting.id;

                    let select = doc.createElement("select");
                    select.id = setting.id;
                    let opt = doc.createElement("option");
                    opt.value = "";
                    opt.textContent = "None";
                    select.appendChild(opt);

                    setting.values.forEach((val) => {
                        let opt = doc.createElement("option");
                        opt.value = val;
                        let spaced = val.replace(/-/g, " ");
                        opt.innerHTML = toTitleCase(spaced);
                        select.appendChild(opt);
                    });

                    setDiv.appendChild(label);
                    setDiv.appendChild(select);
                }

                settings.appendChild(setDiv);
            });
    }

    //AutoMovement
    function circular(rev) {
        let a = 0,
            x = 724, // center
            y = 242, // center
            r = 100; // radius

        mvInterval = setInterval(function () {
            a = (a + Math.PI / 360) % (Math.PI * 2);

            let px = x + r * Math.cos(rev ? -a : a);
            let py = y + r * Math.sin(rev ? -a : a);
            let cli = getClient({
                type: "mousedown",
                clientX: px,
                clientY: py
            });

            pointer_initial.x = 724;
            pointer_initial.y = 242;

            pointer.x = cli.x - pointer_initial.x;
            pointer.y = cli.y - pointer_initial.y;
        }, circularSpeed);
    }

    function move(vertical) {
        let cnt = 0,
            box = doc.querySelector("canvas").getBoundingClientRect(),
            positions = [];

        //center
        let start = !vertical ? box.left + box.width / 2 : box.top + box.height / 2;

        //left/top
        let end = !vertical ? box.left : box.top;

        //right/bottom
        let max = !vertical
            ? box.left + box.width * 0.75
            : box.top + box.height * 0.75;

        //From middle to right/bottom
        for (let a = start; a < max; a++) {
            positions.push({
                x: !vertical ? a : box.left + box.width / 2,
                y: !vertical ? box.top + box.height / 2 : a
            });
        }

        //From right/bottom side to left/top side
        for (let b = max; b > end; b--) {
            positions.push({
                x: !vertical ? b : box.left + box.width / 2,
                y: !vertical ? box.top + box.height / 2 : b
            });
        }

        //From left/top side to middle again
        for (let c = end; c < start; c++) {
            positions.push({
                x: !vertical ? c : box.left + box.width / 2,
                y: !vertical ? box.top + box.height / 2 : c
            });
        }

        if (!positions.length) {
            return false;
        }

        mvInterval = setInterval(function () {
            if (cnt === positions.length) {
                cnt = 0;
            }

            let cli = getClient({
                type: "mousedown",
                clientX: positions[cnt].x,
                clientY: positions[cnt].y
            });

            pointer_initial.x = box.left + box.width / 2;
            pointer_initial.y = box.top + box.height / 2;

            pointer.x = cli.x - pointer_initial.x;
            pointer.y = cli.y - pointer_initial.y;

            cnt++;
        }, linearSpeed);
    }

    function clearMovement() {
        clearInterval(mvInterval);

        pointer.x = 0;
        pointer.y = 0;
        pointer_initial.x = 0;
        pointer_initial.y = 0;
    }

    function getClient(ev) {
        let cliX = 0,
            cliY = 0;

        if (ev && ev.type) {
            switch (ev.type) {
                case "touchmove":
                case "touchstart":
                    cliX = ev.touches[0].clientX;
                    cliY = ev.touches[0].clientY;

                    break;
                case "mousedown":
                case "mousemove":
                    cliX = ev.clientX;
                    cliY = ev.clientY;

                    break;
                default:
                    cliX = 0;
                    cliY = 0;

                    break;
            }
        }

        return {
            x: cliX,
            y: cliY
        };
    }

    function resetCanvasSettings() {
        canvasSettings.motion = false;
        canvasSettings.border = 0;
        canvasSettings.movement = false;
        canvasSettings.size = 1;
        canvasSettings.flipX = false;
        canvasSettings.flipY = false;
        canvasSettings.opacity = 1;
        canvasSettings.color = "#ffffff";

        let canvasMenu = doc.querySelector("#canvasMenu");
        canvasMenu.querySelector("#borderSlider").value = 0;
        canvasMenu.querySelector("#opacitySlider").value = 1;
        canvasMenu.querySelector("#canvasSizeSlider").value = 1;
        canvasMenu.querySelector("#flipButtonHorizontal").checked = false;
        canvasMenu.querySelector("#flipButtonVertical").checked = false;
        canvasMenu.querySelector("#canvasMovement").value = "";

        clearMovement();

        //All checkboxes
        let checks = canvasMenu.querySelectorAll("input");

        for (let i = 0; i < checks.length; i++) {
            if (checks[i].type === "checkbox") {
                checks[i].checked = false;
            }
        }
    }

    function cleanSettings() {
        let l = doc.getElementById("layers");

        l.innerHTML = "";
    }

    function shake(el) {
        let interval = 50,
            distance = 5,
            times = 6;

        for (let i = 0; i < times + 1; i++) {
            (function (index) {
                setTimeout(function () {
                    el.style.position = "absolute";
                    el.style.left = (index % 2 == 0 ? distance : distance * -1) + "px";

                    if (index === times) {
                        el.style.position = "static";
                    }
                }, i * interval);
            })(i);
        }
    }

    function toTitleCase(str) {
        return str.replace(/\w\S*/g, function (txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
    }
})(window, document);
