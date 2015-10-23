package wrapper.model;

public class Model {
	
	//Directions as attributes
		private boolean goingLeft;
	    private boolean goingRight = true; // the snake's default direction
	    private boolean goingUp;
	    private boolean goingDown;
	
	  //Getters for the directions of the snake
		public boolean isGoingLeft() {
			return goingLeft;
		}

		public boolean isGoingRight() {
			return goingRight;
		}

		public boolean isGoingUp() {
			return goingUp;
		}

		public boolean isGoingDown() {
			return goingDown;
		}

		
		//Setters for the direction of the snake
		public void setGoingLeft(boolean goingLeft) {
			this.goingLeft = goingLeft;
		}

		public void setGoingRight(boolean goingRight) {
			this.goingRight = goingRight;
		}

		public void setGoingUp(boolean goingUp) {
			this.goingUp = goingUp;
		}

		public void setGoingDown(boolean goingDown) {
			this.goingDown = goingDown;
		}
		
	    //array von circles, attribut position
	//oeschen den letzten und tun einen neuen dran
	//view array list von x koordinaten
	//in model ob gegen sich selbst
	//in view text view text property die wir an andere property binden, zwei propertoes binden
	//observable array lists
	//evtl nur kopf im Model haben 
	
	//in presenter die tasteneingaben
	
	//netzwerk
	// chatprogramm 2 views mit button und textfeld mit UDP
	
	

}