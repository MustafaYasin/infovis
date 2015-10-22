package wrapper.model;

import javafx.beans.property.SimpleIntegerProperty;

public class Circle {
	
	private SimpleIntegerProperty xCoord = new SimpleIntegerProperty();
	private SimpleIntegerProperty yCoord= new SimpleIntegerProperty();
	private SimpleIntegerProperty radius= new SimpleIntegerProperty();
	
	
	
	public Circle(int xCoord, int yCoord, int radius) {

		this.xCoord.set(xCoord);
		this.yCoord.set(yCoord);
		this.radius.set(radius);
	}


	public SimpleIntegerProperty getxCoord() {
		return xCoord;
	}


	public SimpleIntegerProperty getyCoord() {
		return yCoord;
	}


	public SimpleIntegerProperty getRadius() {
		return radius;
	}


	public void move() {
		this.xCoord.set(xCoord.get()+1);
		
	}
	
	
}
