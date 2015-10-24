package wrapper;

import wrapper.model.Model;
import wrapper.model.SnakeInterface;
import wrapper.view.Presenter;
import wrapper.view.SnakeView;
import javafx.application.Application;
import javafx.stage.Stage;
import javafx.application.Application;
import javafx.application.Platform;
import javafx.collections.FXCollections;
import javafx.geometry.Pos;
import javafx.scene.Scene;
import javafx.scene.control.Button;
import javafx.scene.control.ChoiceBox;
import javafx.scene.control.Label;
import javafx.scene.layout.BorderPane;
import javafx.scene.layout.HBox;
import javafx.scene.layout.VBox;
import javafx.stage.Stage;

import java.io.IOException;

/**
 * Created by Yasna on 10/23/2015.
 */
public class Main extends Application implements SnakeInterface {

    /**
     * called to start the application
     * 
     */
    @Override
    public void start(Stage primaryStage) {
        new Presenter(primaryStage);
    }

    public static void main(String[] args) {
        launch(args);
    }

}
