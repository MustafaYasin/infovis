package wrapper.view;

import javafx.animation.Animation;
import javafx.animation.KeyFrame;
import javafx.animation.Timeline;
import javafx.stage.Stage;
import javafx.util.Duration;
import wrapper.model.Circle;
import wrapper.model.Model;


public class Presenter {
	
	private View view;
	private Model model;
	private Stage stage;
	private Circle circle;

	public Presenter(Stage primaryStage) {
		this.stage=primaryStage;
		this.view = new View();
		this.model = new Model();

		circle = new Circle(150,20,10);
		doBindings();
		
		//Presenter haegt die szene an dem stage
		primaryStage.setScene(view.getScene());
		primaryStage.show();

		Timeline timeline = new Timeline();
		timeline.setCycleCount(Animation.INDEFINITE);
		timeline.getKeyFrames().add(new KeyFrame(Duration.seconds(.0200), e->circle.move()));
		timeline.play();
	}
	
	private void doBindings(){
		circle.getxCoord().bindBidirectional(view.getCircle().centerXProperty());
		circle.getyCoord().bindBidirectional(view.getCircle().centerYProperty());
	}
	
	
			
}
