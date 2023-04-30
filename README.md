[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/1Zvp0ubu)
# Group assignment 01 - WebGL demo

## Task
The task is to implement a small WebGL program that renders a 3D scene that includes some loaded (or procedurally generated) 3D models that are animated.

The implementation has to be done in teams and will be presented in class (exactly 10 minutes).

The code needs to be committed (pushed) into this Github classroom repository. It will be rendered on the teachers laptop (no CUDA, Win11, Firefox or Chrome or Edge).

The code needs to be explained in a short readme.

## Rating
The rating will be as follows:
- presentation and idea: 30 % 
- arts and/or math: 30 %
- code quality: 40 %

## Hints
In order to load a 3D model, [three.js](https://threejs.org) can be used. Follow the [installation instructions](https://threejs.org/docs/#manual/en/introduction/Installation) and create your own scene. Get inspired by the [examples](https://threejs.org/examples/), but come up with your own ideas and models. Use [some control method from three.js](https://threejs.org/examples/?q=controls) in order to make the scene explorable by the user. Note that the animation shall not be stored in the 3D model file, but needs to be defined by transformations in the WebGL JavaScript code. You can combine results and ideas from your individual assignment-shader project.

# Explanation

## Geometry and models
The models are created using 3ds Max and loaded in using the GLTFLoader from threejs.

The scene is a reference to the [UNIGINE Heaven Benchmark](https://youtu.be/3PkXImE8RXo?t=223), which features multiple flying islands as well as an airship.

## Animation
The scene features four objects, three islands and one airship. The islands are floating up and down, using an equation that takes the parameters floating frequency, amplitude and the current time to calculate the y-position of the island. 

The airship has two modes, depending of the state of the "flight mode". If the flight mode is enabled, the user can control the airship using the FlyControls of threejs. If the flight mode is disabled, the airship flies around the island in a loop, stopping at the dock for a few seconds after it has completed a turn. This is archived using a loop function that calculates the position of the airship at any given time.

## Camera
The camera can be controlled using the FlyControls of threejs. The user has the option of controlling the camera freely, or from the perspective of the airship (flight mode). The key for switching flight mode on and off is the spacebar.

## Light
The scene is illuminated using two different light sources - one directional light representing the sun, and one hemisphere light representing the light coming from the sky. 
While the hemisphere light is stationary, the directional light is moving around the scene in a similar way that the airship moves around, but it additionally changes its y-position to simulate the sun going up or down.

The visibility of the positions of the two light sources can be toggled by pressing "L". 