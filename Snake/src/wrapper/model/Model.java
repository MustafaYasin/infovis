package wrapper.model;

import javafx.beans.property.IntegerProperty;
import javafx.beans.property.SimpleIntegerProperty;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

/**
 * @author Yasna
 * @date 23.10.2015
 */
public class Model implements SnakeInterface{

    private Node snakeHead = new Node(GAME_WIDTH/2, GAME_HEIGHT/2);

    private List<Node> body = new ArrayList<>();

    private IntegerProperty points = new SimpleIntegerProperty(0);

    int x = (int)(Math.random()*GAME_WIDTH);
    int y = (int)(Math.random()*GAME_HEIGHT);
    
    private Node food = new Node(x,y);
    
    private boolean foodEaten = false;

    private boolean goingUp;
    private boolean goingDown;
    private boolean goingRight = true;
    private boolean goingLeft;

    public Model() {
        addHead();
        placeFood();
    }

    public List<Node> getBody() {
        return body;
    }

    public void setBody(List<Node> body) {
        this.body = body;
    }

    public int getPoints() {
        return points.get();
    }

    public IntegerProperty pointsProperty() {
        return points;
    }

    public void setPoints(int points) {
        this.points.set(points);
    }

    public Node getFood() {
        return food;
    }

    public void setFood(Node food) {
        this.food = food;
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

    private void addHead() {
        getBody().add(getSnakeHead());
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
    public void addNode(){
        if(foodEaten){
        	body.add(new Node(snakeHead.getxCoo()-14, snakeHead.getyCoo()));
        	
        }
        	
        }


}
