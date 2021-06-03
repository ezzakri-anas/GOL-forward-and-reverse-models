# GOL-forward-and-reverse-models
A convolutional neural network model, `GoL_forward_tfjs`(respectively `GoL_backward_tfjs`), that predicts next state (repectively previous state) of a given generation of Conway's game of life.
#
Both models operates on fixed 25*25 board size where a living cell is defined with 1 and a dead cell is defined with 0. Check the notebooks to see how models are built and how accurate they predict.

### Dependencies
  - matplotlib==3.2.1
  - numpy==1.18.2
  - tensorflow==2.4.0

### Datasets
Made use of my [game-of-life](https://github.com/ezzakri-anas/game-of-life) repository algorithm to generate training data. Data is generated following [Kaggle competition](https://www.kaggle.com/c/conway-s-reverse-game-of-life/data)'s procedure of games creation along with using `delta=1`.
