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
     * called when starting the application
     * creates a new game with playersNr of players, new gameView and sets it in a scene on the given stage
     * creates a new gamePresenter, sets the game modes
     * @param primaryStage Stage on which the gameView should be
     */
    @Override
    public void start(Stage primaryStage) {

        Model model = new Model();

        SnakeView snakeView = new SnakeView(model);

        snakeView.setMaxSize(GAME_WIDTH, GAME_HEIGHT);

        Scene scene = new Scene(snakeView);

        primaryStage.setWidth(GAME_WIDTH);
        primaryStage.setHeight(GAME_HEIGHT);

        primaryStage.setScene(scene);
        primaryStage.setResizable(false);
        primaryStage.show();

        Presenter snakePresenter = new Presenter(model, snakeView);
    }

    public static void main(String[] args) {
        launch(args);
    }

}
