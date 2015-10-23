package wrapper.view;
import wrapper.model.Model;
import wrapper.model.SnakeInterface;
import javafx.beans.binding.Bindings;
import javafx.scene.Scene;
import javafx.scene.layout.BorderPane;
import javafx.scene.layout.Pane;
import javafx.scene.paint.Color;
import javafx.scene.shape.Circle;

/**
 *@author Yasna
 *@date 23.10.2015
 */
public class SnakeView extends BorderPane implements SnakeInterface {

	private Model model;
    private Circle snakeHead;
    private Circle food;


    public SnakeView(Model model) {
    	
        this.model = model;
        snakeHead = new Circle(this.model.getSnakeHead().getxCoo(),this.model.getSnakeHead().getyCoo(), radius, Color.BLACK);

        snakeHead.centerXProperty().bindBidirectional(this.model.getSnakeHead().xCooProperty());
        snakeHead.centerYProperty().bindBidirectional(this.model.getSnakeHead().yCooProperty());

        food = new Circle(this.model.getFood().getxCoo(), this.model.getFood().getyCoo(), radius, Color.RED);

        food.centerXProperty().bindBidirectional(this.model.getFood().xCooProperty());
        food.centerYProperty().bindBidirectional(this.model.getFood().yCooProperty());

        this.getChildren().addAll(snakeHead,food);
      
    }

    public Model getModel() {
        return model;
    }

    public void setModel(Model model) {
        this.model = model;
    }
    

	public Circle getSnakeHead() {
        return snakeHead;
    }

    public void setSnakeHead(Circle snakeHead) {
        this.snakeHead = snakeHead;
    }

    public Circle getFood() {
        return food;
    }

    public void setFood(Circle food) {
        this.food = food;
    }
}
