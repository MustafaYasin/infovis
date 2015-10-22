package wrapper;

import wrapper.view.Presenter;
import javafx.application.Application;
import javafx.stage.Stage;

public class Main extends Application{

	@Override
	public void start(Stage primaryStage) throws Exception {
		// TODO Auto-generated method stub
		new Presenter(primaryStage);
		
	}
	
	public static void main(String[] args) {
		launch(args);
	}

	
}
