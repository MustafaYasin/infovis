import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;

import javax.swing.JFileChooser;

public class Controller implements ActionListener {
	
	View thisView;
	Model thisModel;
	
	private boolean allState;
	
	
	public Controller(){
	
	thisModel = new Model();
	thisView = new View(this);
	thisView.setVisible(true);
	thisModel.addObserver(thisView);
	thisView.setVisible(true);
	allState=false;

	
}

	public void actionPerformed(ActionEvent event) {
		String cmd = event.getActionCommand();

		if (cmd.equals("Load File")){ 
			openFile();
		}
		if (cmd.equals("Exit")){
			System.exit(0);
		}
		if (cmd.equals("About Medientechnik")){
			thisView.showAbout();
		}
		if (cmd.equals("All")){
			if(this.allState){ 
				thisModel.disableFilter("Blur, Distort, Sharpen, Contrast, Invert, B/W, Zoom, Edge Detection, Green, Pointillize");
				this.allState = false;
			}
			else {
				thisModel.enableFilter("Blur, Distort, Sharpen, Contrast, Invert, B/W, Zoom, Edge Detection, Green, Pointillize");
				this.allState = true;
			}

			
		}
		
//RANDOM FILTER	
		if (cmd.equals("Random")){

			int filter = (int)Math.round(Math.random() * 5.9);
						
			switch (filter){
			
				case 0:
					thisModel.disableFilter("Distort, Sharpen, Contrast, Invert, B/W, Zoom");
					
					thisModel.switchFilter("Blur");
					break;
				case 1:
					thisModel.disableFilter("Blur, Sharpen, Contrast, Invert, B/W, Zoom");
					thisModel.switchFilter("Distort");
					
					break;
				case 2:
					thisModel.disableFilter("Blur, Distort, Sharpen, Invert, B/W, Zoom");
					thisModel.switchFilter("Contrast");
					
					break;
				case 3:
					thisModel.disableFilter("Blur, Distort, Sharpen, Contrast, B/W, Zoom");
					thisModel.switchFilter("Invert");
					
					break;
				case 4:
					thisModel.disableFilter("Blur, Distort, Sharpen, Contrast, Invert, Zoom");
					thisModel.switchFilter("B/W");
					
					break;
				case 5:
					thisModel.disableFilter("Blur, Distort, Sharpen, Contrast, Invert, B/W");
					thisModel.switchFilter("Zoom");
					
					break;
				case 6:
					thisModel.disableFilter("Blur, Distort, Contrast, Invert, B/W, Zoom");
					thisModel.switchFilter("Sharpen");
					break;
			}
		}

		if (cmd.equals("Blur")){
			thisModel.switchFilter("Blur");
			thisView.allButton.setSelected(false);
			this.allState=false;
		}
		if (cmd.equals("Distort")){
			thisModel.switchFilter("Distort");
			thisView.allButton.setSelected(false);
			this.allState=false;
		}
		if (cmd.equals("Sharpen")){
			thisModel.switchFilter("Sharpen");
			thisView.allButton.setSelected(false);
			this.allState=false;
		}
		if (cmd.equals("Contrast")){
			thisModel.switchFilter("Contrast");
			thisView.allButton.setSelected(false);
			this.allState=false;
		}
		if (cmd.equals("Invert")){
			thisModel.switchFilter("Invert");
			thisView.allButton.setSelected(false);
			this.allState=false;
		}
		if (cmd.equals("B/W")){
			thisModel.switchFilter("B/W");
			thisView.allButton.setSelected(false);
			this.allState=false;
		}
		if (cmd.equals("Zoom")){
			thisModel.switchFilter("Zoom");
			thisView.allButton.setSelected(false);
			this.allState=false;
		}
		if (cmd.equals("Edge Detection")){
			thisModel.switchFilter("Edge Detection");
			thisView.allButton.setSelected(false);
			this.allState=false;
		}
		if (cmd.equals("Green")){
			thisModel.switchFilter("Green");
			thisView.allButton.setSelected(false);
			this.allState=false;
		}
		if (cmd.equals("Pointillize")){
			thisModel.switchFilter("Pointillize");
			thisView.allButton.setSelected(false);
			this.allState=false;
		}
	}
	
//File chooser for picture upload
	private void openFile() {
		JFileChooser fc = new JFileChooser();		
		int state = fc.showOpenDialog(null);
		
	    if (state == JFileChooser.APPROVE_OPTION){
		    thisModel.setImage(fc.getSelectedFile().getPath());
	    }
	}

}


