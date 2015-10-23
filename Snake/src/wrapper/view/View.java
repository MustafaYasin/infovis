package wrapper.view;

import javafx.scene.Scene;
import javafx.scene.layout.Pane;
import javafx.scene.shape.Circle;

//nur szene erzeugen

public class View {
	
	private Scene scene;
	private final Pane root = new Pane();
	private final Circle circle = new Circle(20, 20, 10);
	
	public View(){
		root.getChildren().add(circle);
		scene = new Scene(root, 600, 600);	
	}

	public Scene getScene() {
		return scene;
	}

	public Circle getCircle() {
		return circle;
	}
		
	
}