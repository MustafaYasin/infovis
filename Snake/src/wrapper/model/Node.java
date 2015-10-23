package wrapper.model;

import javafx.beans.property.IntegerProperty;
import javafx.beans.property.SimpleIntegerProperty;

/**
 * Created by Yasna on 10/23/2015.
 */
public class Node {

    private IntegerProperty xCoo = new SimpleIntegerProperty();
    private IntegerProperty yCoo = new SimpleIntegerProperty();

    public Node(int xCoo, int yCoo) {
        this.setxCoo(xCoo);
        this.setyCoo(yCoo);
    }

    public int getxCoo() {
        return xCoo.get();
    }

    public IntegerProperty xCooProperty() {
        return xCoo;
    }
    
    public IntegerProperty yCooProperty() {
        return yCoo;
    }

    public void setxCoo(int xCoo) {
        this.xCoo.set(xCoo);
    }

    public int getyCoo() {
        return yCoo.get();
    }


    public void setyCoo(int yCoo) {
        this.yCoo.set(yCoo);
    }
}
