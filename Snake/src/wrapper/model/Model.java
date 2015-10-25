package wrapper.model;
import javafx.beans.property.IntegerProperty;
import javafx.beans.property.SimpleIntegerProperty;
import javafx.beans.property.SimpleObjectProperty;
import javafx.scene.input.KeyEvent;
import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;
import java.util.Random;
/**
 * @author Yasna
 * @date 23.10.2015
 */
public class Model implements SnakeInterface{


    private Node snakeHead = new Node(GAME_WIDTH/2, GAME_HEIGHT/2);

    private SimpleObjectProperty <Node> head = new SimpleObjectProperty<Node>();
    // private IntegerProperty points = new SimpleIntegerProperty(0);

    private Node foodValue = new Node((int)(Math.random()*GAME_WIDTH), (int)(Math.random()*GAME_HEIGHT));

    private SimpleObjectProperty<Node> food = new SimpleObjectProperty<Node>();


    private boolean foodEaten = false;

    /**the direction in which the snake should move
     * 0 for UP
     * 1 for DOWN
     * 2 for RIGHT
     * 3 for LEFT
     */
    private int direction = 2;

    /**IntegerProperty bound to the View which has the current length of the snake.
     * View has the same Property attribute.
     */
    private SimpleIntegerProperty length = new SimpleIntegerProperty();

    /**Constructor that creates a snake*/
    public Model() {
        head.set(snakeHead);
        length.set(3);
        food.set(foodValue);
    }

    /**Game Loop is called by the Presenter
     * so that the snake can move
     * collision() TO DO !!!!
     */
    public void gameLoop(){
        snakeMove();
        collision();
    }

    private void snakeMove() {
        switch (direction){

            case 0:
                head.set(new Node(head.get().getxCoo(), head.get().getyCoo() - radius*2));
                break;

            case 1:
                head.set(new Node(head.get().getxCoo(), head.get().getyCoo() + radius*2));
                break;

            case 2:
                head.set(new Node(head.get().getxCoo() + radius*2, head.get().getyCoo()));
                break;

            case 3:
                System.out.println(head);
                Node n = new Node(head.get().getxCoo() - radius*2, head.get().getyCoo());
                head.set(n);
                break;
        }


    }

    public void setDirection(KeyEvent event) {

        switch (event.getCode()){

            case UP:
                if(direction!=1) direction=0;
                break;

            case DOWN:
                if(direction!=0) direction=1;
                break;

            case RIGHT:
                if(direction!=3) direction=2;
                break;

            case LEFT:
                if(direction!=2) direction=3;
                break;
        }


    }

    private void placeFood(){
        food.get().setxCoo((int)(Math.random()*GAME_WIDTH));
        food.get().setyCoo((int)(Math.random()*GAME_HEIGHT));
    }


    private void collision() {
        if(head.get().getxCoo()==food.get().getxCoo() && head.get().getyCoo()==food.get().getyCoo() ){
            placeFood();
            addBodyPart();

        }


    }

    private void addBodyPart(){
        length.add(1);
    }
    public SimpleObjectProperty <Node> getFood() {
        return food;
    }

    public boolean isFoodEaten() {
        return foodEaten;
    }
    public void setFoodEaten(boolean foodEaten) {
        this.foodEaten = foodEaten;
    }
    public Node getSnakeHead() {
        return snakeHead;
    }
    public void setSnakeHead(Node snakeHead) {
        this.snakeHead = snakeHead;
    }
    public SimpleObjectProperty<Node> getHead() {
        return head;
    }


    public SimpleIntegerProperty getLength() {
        return length;
    }




}
  /*  private void addHead() {
        getBody().addFirst(getSnakeHead());
    }
    public void placeFood() {
        int x = (int)(Math.random()*GAME_WIDTH);
        int y = (int)(Math.random()*GAME_HEIGHT);
        this.food.setxCoo(x);
        this.food.setyCoo(y);
    }
    public boolean isGoingUp() {
        return goingUp;
    }
    public void setGoingUp(boolean goingUp) {
        this.goingUp = goingUp;
    }
    public boolean isGoingDown() {
        return goingDown;
    }
    public void setGoingDown(boolean goingDown) {
        this.goingDown = goingDown;
    }
    public boolean isGoingRight() {
        return goingRight;
    }
    public void setGoingRight(boolean goingRight) {
        this.goingRight = goingRight;
    }
    public boolean isGoingLeft() {
        return goingLeft;
    }
    public void setGoingLeft(boolean goingLeft) {
        this.goingLeft = goingLeft;
    }


    //this must ge impelmented too
    public void snakeGrow(){
        if(!foodEaten){
        	body.addFirst(new Node(snakeHead.getxCoo()-14, snakeHead.getyCoo()));

        }

        }
}*/
