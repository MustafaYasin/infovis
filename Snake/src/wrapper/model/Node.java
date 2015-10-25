package wrapper.model;

import javafx.beans.property.IntegerProperty;
import javafx.beans.property.SimpleIntegerProperty;

/**
 * @author Yasna
 * @date 23.10.2015
 */
public class Node implements SnakeInterface {

    private int xCoo;
    private int yCoo;

    public Node(int xCoo, int yCoo) {
        this.xCoo=xCoo;
        this.yCoo=yCoo;
       
    }

	public int getxCoo() {
		return xCoo;
	}

	public int getyCoo() {
		return yCoo;
	}
    

  


}