package wrapper.view;

import javafx.animation.KeyFrame;
import javafx.animation.Timeline;
import javafx.beans.value.ChangeListener;
import javafx.beans.value.ObservableValue;
import javafx.event.EventHandler;
import javafx.scene.Scene;
import javafx.scene.input.KeyCode;
import javafx.scene.input.KeyEvent;
import javafx.scene.shape.Circle;
import javafx.scene.shape.Shape;
import javafx.stage.Stage;
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
	private Stage primaryStage;
	private Scene scene;

/**Constructor
 * 
 * Presenter receives only stage as an argument,
 * creates a model, view and starts the method gameLoop()
 * so that the snake can move.
 * It also calls the method doBindings() which
 * binds a View object to a property(object) in Model, 
 * such that a change in either is reflected in the other.
 * 
 * @param stage
 */
    public Presenter(Stage stage) {
        this.primaryStage=stage;
        model = new Model();
        view = new SnakeView();
        model.gameLoop();
        show();
        doBindings();
        play();
        
    }
    
    
 /** The attribute scene of the Presenter 
  *  gets the view as a scene so that it can be showed
  */
    private void show(){
    	view.setMaxSize(GAME_WIDTH, GAME_HEIGHT);

        scene = new Scene(view);

        primaryStage.setWidth(GAME_WIDTH);
        primaryStage.setHeight(GAME_HEIGHT);

        primaryStage.setScene(scene);
        primaryStage.setResizable(false);
        primaryStage.show();
    }
    
  /**when doBindings() gets called
   * the binded properties in View 
   * change so that they match these in Model
   * (the binding is NOT bidirectional)
   */
    
    public void doBindings(){
    	view.getSnake().bind(model.getHead());
    	view.getLength().bind(model.getLength());
    }
    
 /**play() keeps the game running
  * e.g frame duration can be changed here
  * 
  */
    public void play() {


        timeline = new Timeline();
        timeline.setCycleCount(Timeline.INDEFINITE);
        middleFrame = new KeyFrame(Duration.millis(300), e -> model.gameLoop());
        timeline.getKeyFrames().add(middleFrame);
        timeline.play();
        
        //
        scene.addEventHandler(KeyEvent.KEY_PRESSED, event -> model.setDirection(event));

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



     /** how the move method should work
      * 
      * 1. is the cell free or with food
      * 2. if free we move the last element to the front (change coordinates)
      * 3. keep in mind the direction for the coordinates
      * 
      * 
      * 
      */
  /*      
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
        
        */

}
