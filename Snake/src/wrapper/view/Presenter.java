package wrapper.view;

import javafx.animation.KeyFrame;
import javafx.animation.Timeline;
import javafx.beans.value.ChangeListener;
import javafx.beans.value.ObservableValue;
import javafx.event.EventHandler;
import javafx.scene.input.KeyCode;
import javafx.scene.input.KeyEvent;
import javafx.scene.shape.Circle;
import javafx.scene.shape.Shape;
import javafx.util.Duration;

import wrapper.model.*;

/**
 * @authorYasna
 * @date 23.10.2015
 */
public class Presenter implements SnakeInterface {

    private Model model;
    private SnakeView view;

    private KeyFrame middleFrame;
    private Timeline timeline;


    public Presenter(Model model, SnakeView view) {
        this.model = model;
        this.view = view;
        play();
    }

    public Model getModel() {
        return model;
    }

    public void setModel(Model model) {
        this.model = model;
    }

    public SnakeView getView() {
        return view;
    }

    public void setView(SnakeView view) {
        this.view = view;
    }

    public KeyFrame getMiddleFrame() {
        return middleFrame;
    }

    public void setMiddleFrame(KeyFrame middleFrame) {
        this.middleFrame = middleFrame;
    }

    public Timeline getTimeline() {
        return timeline;
    }

    public void setTimeline(Timeline timeline) {
        this.timeline = timeline;
    }

    public void play() {


            timeline = new Timeline();
            timeline.setCycleCount(Timeline.INDEFINITE);
            timeline.setAutoReverse(true);
            middleFrame = new KeyFrame(Duration.millis(10), e -> moveSnake());
            timeline.getKeyFrames().add(middleFrame);
            timeline.play();

            view.getScene().addEventHandler(KeyEvent.KEY_PRESSED, keyHandler);
            view.getScene().addEventHandler(KeyEvent.KEY_RELEASED, keyHandler);

        }

    public void moveSnake(){

        //basic movements
        if(getModel().isGoingDown()){
            getView().getSnakeHead().setCenterY(getView().getSnakeHead().getCenterY() + snakeSpeed);
        }
        else if (getModel().isGoingUp()){
            getView().getSnakeHead().setCenterY(getView().getSnakeHead().getCenterY() - snakeSpeed);
        }
        else if(getModel().isGoingRight()){
            getView().getSnakeHead().setCenterX(getView().getSnakeHead().getCenterX() + snakeSpeed);
        }
        else if(getModel().isGoingLeft()){
            getView().getSnakeHead().setCenterX(getView().getSnakeHead().getCenterX() - snakeSpeed);
        }


        //methods so that the snake can go "through" the walls
        if (getView().getSnakeHead().getCenterX()> GAME_WIDTH){
            getView().getSnakeHead().setCenterX(0);
        }
        else if(getView().getSnakeHead().getCenterX() < 0){
            getView().getSnakeHead().setCenterX(GAME_WIDTH);
        }
        else if(getView().getSnakeHead().getCenterY() > GAME_HEIGHT){
            getView().getSnakeHead().setCenterY(0);
        }
        else if(getView().getSnakeHead().getCenterY() < 0){
            getView().getSnakeHead().setCenterY(GAME_HEIGHT);
        }


        collide();

    }

    private void collide() {

        if (getView().getSnakeHead().getBoundsInParent().intersects(getView().getFood().getBoundsInParent())) {
                 
        	Shape intersect = Shape.intersect(getView().getSnakeHead(), getView().getFood());
                    
            if (intersect.getBoundsInLocal().getHeight() != -1) {
            	 getModel().setFoodEaten(true);
                 getView().getChildren().remove(getView().getFood());
                 getModel().placeFood();
                 getView().getChildren().add(getView().getFood());
                }
            }
        }

    EventHandler keyHandler = new EventHandler<KeyEvent>() {
            @Override
            public void handle(KeyEvent e) {
                if (e.getEventType() == KeyEvent.KEY_PRESSED) {

                    KeyCode k = e.getCode();

                    switch (k) {
                        case UP:
                            if (getModel().isGoingDown())
                                break;
                            getModel().setGoingUp(true);
                            getModel().setGoingDown(false);
                            getModel().setGoingLeft(false);
                            getModel().setGoingRight(false);
                            break;
                        case DOWN:
                            if (getModel().isGoingUp())
                                break;
                            getModel().setGoingUp(false);
                            getModel().setGoingDown(true);
                            getModel().setGoingLeft(false);
                            getModel().setGoingRight(false);
                            break;
                        case RIGHT:
                            if (getModel().isGoingLeft())
                                break;
                            getModel().setGoingUp(false);
                            getModel().setGoingDown(false);
                            getModel().setGoingLeft(false);
                            getModel().setGoingRight(true);
                            break;
                        case LEFT:
                            if (getModel().isGoingRight())
                                break;
                            getModel().setGoingUp(false);
                            getModel().setGoingDown(false);
                            getModel().setGoingLeft(true);
                            getModel().setGoingRight(false);
                            break;
                    }

                    // e.consume();
                }
            }

        };

}
