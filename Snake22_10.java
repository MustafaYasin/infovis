package Snake;

import java.util.ArrayList;
import java.util.LinkedList;
import java.util.Random;

import javafx.application.Application;
import javafx.animation.KeyFrame;
import javafx.animation.Timeline;
import javafx.application.Application;
import javafx.scene.Group;
import javafx.scene.Scene;
import javafx.scene.image.Image;
import javafx.scene.image.ImageView;
import javafx.scene.input.KeyCode;
import javafx.scene.input.KeyEvent;
import javafx.scene.paint.Color;
import javafx.scene.shape.Circle;
import javafx.scene.shape.Rectangle;
import javafx.stage.Stage;
import javafx.util.Duration;

/**
 * Created by Yasna on 10/17/2015.
 */
public class Snake extends Application{


    private Scene scene;
    private Circle snakeHead;
    private Circle fruit;
    LinkedList<Circle> body = new LinkedList<Circle>();
    private double speed = 2;
    private boolean goingLeft;
    private boolean goingRight = true; // the snake's default direction
    private boolean goingUp;
    private boolean goingDown;

    public Random randomValue; //getting a random value for the fruit


    public Scene getScene() {
        return scene;
    }

    public void setScene(Scene scene) {
        this.scene = scene;
    }

    public Circle getSnake() {
        return snakeHead;
    }

    public void setSnake(Circle snakehead) {
        this.snakeHead = snakehead;
    }

    public double getSpeed() {
        return speed;
    }

    public void setSpeed(double speed) {
        this.speed = speed;
    }

    //Getters for the direction of the snake
    public boolean isGoingLeft() {
        return goingLeft;
    }

    public void setGoingLeft(boolean goingLeft) {
        this.goingLeft = goingLeft;
    }

    public boolean isGoingRight() {
        return goingRight;
    }

    public void setGoingRight(boolean goingRight) {
        this.goingRight = goingRight;
    }

    public boolean isGoingUp() {
        return goingUp;
    }

    //Setters for the direction of the snake
    public void setGoingUp(boolean goingUp) {
        this.goingUp = goingUp;
    }

    public boolean isGoingDown() {
        return goingDown;
    }

    public void setGoingDown(boolean goingDown) {
        this.goingDown = goingDown;
    }

    public void start(Stage primaryStage) throws Exception {

        Group root = new Group();
        scene = new Scene(root, 800, 700);
        scene.setFill(Color.AQUA);
        primaryStage.setResizable(false);

        // Snake
        snakeHead = new Circle(20);
        snakeHead.setCenterX(scene.getWidth() / 2);
        snakeHead.setCenterY(scene.getHeight() / 2);
        snakeHead.setFill(Color.FUCHSIA);
        snakeHead.setStroke(Color.BLACK);
        snakeHead.setStrokeWidth(1);


        //adding the fruit
        randomValue=new Random();
        fruit = new Circle(20);
        fruit.setCenterX(randomValue.nextInt(750));
        fruit.setCenterY(randomValue.nextInt(650));
        fruit.setFill(Color.GREEN);
        fruit.setStroke(Color.BLACK);
        fruit.setStrokeWidth(1);

        // load the diamond
        Image image = new Image("https://cdn4.iconfinder.com/data/icons/free-3d-social-icons/png/20x20/Duckling.png");
        // simple displays ImageView the image as is
        ImageView diamond = new ImageView();
        diamond.setImage(image);
        //scaling the image
        diamond.setFitWidth(55);
        diamond.setPreserveRatio(true);
        diamond.setSmooth(true);
        diamond.setCache(true);
        diamond.setX(randomValue.nextInt(750));
        diamond.setY(randomValue.nextInt(650));

        // adding snake and diamond(fruit) to the layout
        //fruit is not added to the scene and doesn't appear for now
        root.getChildren().add(snakeHead);
        root.getChildren().add(diamond);

        // set scene
        primaryStage.setScene(scene);
        primaryStage.setTitle(("halbe h´s"));
        primaryStage.requestFocus();
        primaryStage.show();


        //set event Handler
        snakeHead.setOnKeyPressed(e -> handlePress(e));
        //set focus on the snake
        snakeHead.requestFocus();

        KeyFrame k = new KeyFrame(Duration.millis(10), e -> {
            moveSnake(); // snake animation
        });

        Timeline t = new Timeline(k);
        t.setCycleCount(Timeline.INDEFINITE);
        t.play();

    }


    public void handlePress(KeyEvent e) {

        KeyCode k = e.getCode();

        switch (k) {
            case UP:
                if(!(goingUp)){
                    this.setGoingUp(true);
                    this.setGoingDown(false);
                    this.setGoingLeft(false);
                    this.setGoingRight(false);
                    break;
                }
            case DOWN:
                if(!(goingDown)){
                    this.setGoingUp(false);
                    this.setGoingDown(true);
                    this.setGoingLeft(false);
                    this.setGoingRight(false);
                    break;
                }
            case RIGHT:
                if(!(goingRight)){
                    this.setGoingUp(false);
                    this.setGoingDown(false);
                    this.setGoingLeft(false);
                    this.setGoingRight(true);
                    break;
                }

            case LEFT:
                if(!(goingLeft)){
                    this.setGoingUp(false);
                    this.setGoingDown(false);
                    this.setGoingLeft(true);
                    this.setGoingRight(false);
                    break;
                }

        }

        // e.consume();
    }

    public void moveSnake() {

        //basic movements
        if(this.isGoingDown()){
            snakeHead.setCenterY(snakeHead.getCenterY() + speed);
        }
        else if(this.isGoingUp()){
            snakeHead.setCenterY(snakeHead.getCenterY() - speed);
        }
        else if(this.isGoingRight()){
            snakeHead.setCenterX(snakeHead.getCenterX() + speed);
        }
        else if(this.isGoingLeft()){
            snakeHead.setCenterX(snakeHead.getCenterX() - speed);
        }


        //methods so that the snake can go "through" the walls
        if (snakeHead.getCenterX()> scene.getWidth()){
            snakeHead.setCenterX(0);
        }
        else if(snakeHead.getCenterX() < 0){
            snakeHead.setCenterX(scene.getWidth());
        }
        else if(snakeHead.getCenterY() > scene.getHeight()){
            snakeHead.setCenterY(0);
        }
        else if(snakeHead.getCenterY() < 0){
            snakeHead.setCenterY(scene.getHeight());
        }



    }



    public static void main(String[] args) {
        launch(args);
    }
}