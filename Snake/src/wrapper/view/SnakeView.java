package wrapper.view;
import java.beans.PropertyChangeEvent;

import wrapper.model.Model;
import wrapper.model.SnakeInterface;
import javafx.beans.binding.Bindings;
import javafx.beans.property.SimpleIntegerProperty;
import javafx.beans.property.SimpleObjectProperty;
import javafx.beans.value.ChangeListener;
import javafx.beans.value.ObservableValue;
import javafx.scene.Scene;
import javafx.scene.layout.BorderPane;
import javafx.scene.layout.Pane;
import javafx.scene.paint.Color;
import javafx.scene.shape.Circle;
import wrapper.model.Node;

/**
 *@author Yasna
 *@date 23.10.2015
 */
public class SnakeView extends BorderPane implements SnakeInterface {

    private Circle head;
    
    private Circle food;
    
    private SimpleObjectProperty <Node> snake  = new SimpleObjectProperty<>();
    
    private SimpleIntegerProperty length = new SimpleIntegerProperty();


    public SnakeView() {
    	snake.addListener(new ChangeListener<Node>() {

			@Override
			public void changed(ObservableValue<? extends Node> arg0,
					Node arg1, Node arg2) {
				if(getChildren().size()>length.get()){
					getChildren().remove(0);
				}
				getChildren().add(new Circle(snake.get().getxCoo(), snake.get().getyCoo(), radius));
			}
    		
    	});
      
    }
    

	public SimpleObjectProperty<Node> getSnake() {
		return snake;
	}

	public Circle getHead() {
        return head;
    }

    public void setHead(Circle snakeHead) {
        this.head = snakeHead;
    }

    public Circle getFood() {
        return food;
    }

    public void setFood(Circle food) {
        this.food = food;
    }


	public SimpleIntegerProperty getLength() {
		return length;
	}
    
    
}
