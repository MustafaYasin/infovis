import java.awt.BorderLayout;
import java.awt.FlowLayout;
import java.awt.GridBagConstraints;
import java.awt.GridBagLayout;
import java.awt.Image;
import java.awt.Toolkit;
import java.util.Observable;
import java.util.Observer;

import javax.swing.ImageIcon;
import javax.swing.JButton;
import javax.swing.JCheckBoxMenuItem;
import javax.swing.JFileChooser;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JMenu;
import javax.swing.JMenuBar;
import javax.swing.JMenuItem;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.JRadioButton;
import javax.swing.JSeparator;
import javax.swing.JTextField;


/**
 * View GUI
 * @author Yasna Mindilikova
 * @version 1
 *
 */
public class View extends JFrame implements Observer {
	
/**
 * Pictures and Labels
 **/
	
	private ImageIcon originalImage;
	private ImageIcon filteredImage;
	private JLabel labelOriginal;
	private JLabel labelFiltered;
	
	/**
	 * Buttons and Effects
	 **/
	JRadioButton allButton;
	JCheckBoxMenuItem blur;
	JCheckBoxMenuItem distort;
	JCheckBoxMenuItem sharpen;
	JCheckBoxMenuItem contrast;
	JCheckBoxMenuItem invert;
	JCheckBoxMenuItem bw;
	JCheckBoxMenuItem zoom;
	JCheckBoxMenuItem edgeDetection;
	JCheckBoxMenuItem green;
	JCheckBoxMenuItem point;
	JMenuItem aboutMI;
	JButton randomButton;

	/**
	 * Textfield showing the active filters
	 **/
	
	JTextField textfieldfilter;
	


	/**
	 * Konsruktor for our View
	 * 
	 * @param thisController
	 */
	public View(Controller thisController){
		
		/**
		 * Title set
		 **/
		this.setTitle("Medientechnik");	
		
		/**
		 * Menubar
		 **/		
		JMenuBar menubar = new JMenuBar();
		
		/**
		 * File Uploader
		 **/
		JMenu file= new JMenu("File");
		JFileChooser jfc = new JFileChooser();
		JMenuItem load= new JMenuItem("Load File");
		load.addActionListener(thisController);
	
		JMenuItem exit = new JMenuItem("Exit");
		exit.addActionListener(thisController);
		
		/**
		 * Effects in the Menubar
		 **/
		JMenu filter= new JMenu("Filters");
		blur= new JCheckBoxMenuItem("Blur");
		blur.addActionListener(thisController);
		distort= new JCheckBoxMenuItem("Distort");
		distort.addActionListener(thisController);
		sharpen= new JCheckBoxMenuItem("Sharpen");
		sharpen.addActionListener(thisController);
		contrast= new JCheckBoxMenuItem("Contrast");
		contrast.addActionListener(thisController);
		invert= new JCheckBoxMenuItem("Invert");
		invert.addActionListener(thisController);
		bw= new JCheckBoxMenuItem("B/W");
		bw.addActionListener(thisController);
		zoom= new JCheckBoxMenuItem("Zoom");
		zoom.addActionListener(thisController);
		edgeDetection= new JCheckBoxMenuItem("Edge Detection");
		edgeDetection.addActionListener(thisController);
		green= new JCheckBoxMenuItem("Green");
		green.addActionListener(thisController);
		point= new JCheckBoxMenuItem("Pointillize");
		point.addActionListener(thisController);
	    JMenu about = new JMenu("About");
	    aboutMI = new JMenuItem("About Medientechnik");
	    aboutMI.addActionListener(thisController);
	    
	    menubar.add(file);
		menubar.add(filter);
		menubar.add(about);
		filter.add(blur);
		filter.add(distort);
		filter.add(sharpen);
		filter.add(contrast);
		filter.add(invert);
		filter.add(bw);
		filter.add(zoom);
		filter.add(edgeDetection);
		filter.add(green);
		filter.add(point);
		about.add(aboutMI);
		file.add(load);
		file.addSeparator();
		file.add(exit);
		

		/**
		 * Picture Panel 
		 **/
		JPanel bilder = new JPanel();
		
		/**
		 * GridBagLayout of the picture panel
		 **/
		bilder.setLayout(new GridBagLayout());
		GridBagConstraints c = new GridBagConstraints();
		originalImage = new ImageIcon();
		filteredImage = new ImageIcon();
		labelOriginal = new JLabel(originalImage);
		labelFiltered = new JLabel(filteredImage);
		originalImage.setImageObserver(labelOriginal);
		filteredImage.setImageObserver(labelFiltered);

		c.gridx = 0;
		c.gridy= 0;
		bilder.add(labelOriginal,c);
		c.gridx = 1;
		c.gridy = 0;
		bilder.add(labelFiltered,c);
		c.gridx=0;
		c.gridy=1;
		bilder.add(new JLabel("Original"),c);
		c.gridx=1;
		c.gridy=1;
		bilder.add(new JLabel("Preview"),c);
		
		
		/**
		 * Separator line between pictures and effect panel
		 **/
		JSeparator separator = new JSeparator();

		
		/**
		 * Effect panel
		 **/
		JPanel effects = new JPanel();
        allButton = new JRadioButton("All");
        allButton.addActionListener(thisController);
        randomButton = new JButton("Random");
        randomButton.addActionListener(thisController);
        JLabel filterLabel = new JLabel("Filters:");
        textfieldfilter = new JTextField(70);

        
       
        effects.setLayout(new FlowLayout());        
        effects.add(allButton);
 	   	effects.add(randomButton);
        effects.add(filterLabel);
        effects.add(textfieldfilter);

		
		this.setJMenuBar(menubar);
		this.add(bilder, BorderLayout.NORTH); 
		this.add(separator, BorderLayout.CENTER);
		this.add(effects, BorderLayout.SOUTH);
		
		this.setDefaultCloseOperation(EXIT_ON_CLOSE);
		this.pack();
		this.repaint();
		this.setVisible(true);
	
	}

	
//Info zu Medientechnik
	public void showAbout(){
		JOptionPane.showMessageDialog(this,"Das ist eine kleine Uebung zur Vorlesung Medientechnik");
	}

		

		/** 
		 * @see java.util.Observer#update(java.util.Observable, java.lang.Object)
		 */
	
		/** 
		 * @see java.util.Observer#update(java.util.Observable, java.lang.Object)
		 **/
		public void update(Observable o, Object arg1) {
			Model model = (Model) o;
			
			/**
			 * Update image size
			 **/
			if (model.receivedNewImage()){
				originalImage.setImage(model.getOriginalImage());
				filteredImage.setImage(model.getFilteredImage());
							
				double screenWidth = Toolkit.getDefaultToolkit().getScreenSize().getWidth();
				double screenHeight = Toolkit.getDefaultToolkit().getScreenSize().getHeight();
				
//// Scale for picture width * 2, because we have the same photo twice + 50 px am rand, so that it looks better

			if ((originalImage.getImage().getWidth(null)*2 + 50) > screenWidth){
					double scale = (screenWidth - 30) / (originalImage.getImage().getWidth(null)*2);
					int newWidth =  (int)(scale * originalImage.getImage().getWidth(null));
					int newHeight = (int)(scale * originalImage.getImage().getHeight(null));
					
					Image scaledImg = originalImage.getImage().getScaledInstance(newWidth, newHeight, Image.SCALE_SMOOTH);
					originalImage.setImage(scaledImg);
					
					scaledImg = filteredImage.getImage().getScaledInstance(newWidth, newHeight, Image.SCALE_SMOOTH);
					filteredImage.setImage(scaledImg);	
				}
				
//Scale + 100 px for menubar, effect panel und borders 
				if (originalImage.getImage().getHeight(null) + 100 > screenHeight){
					double scale = (screenHeight - 100) / (originalImage.getImage().getHeight(null));
					int newWidth =  (int)(scale * originalImage.getImage().getWidth(null));
					int newHeight = (int)(scale * originalImage.getImage().getHeight(null));
					
					Image scaledImg = originalImage.getImage().getScaledInstance(newWidth, newHeight, Image.SCALE_SMOOTH);
					originalImage.setImage(scaledImg);
					
					scaledImg = filteredImage.getImage().getScaledInstance(newWidth, newHeight, Image.SCALE_SMOOTH);
					filteredImage.setImage(scaledImg);
				}
				
				this.pack();

		
				/**
				 * Title Update
				 **/
				this.setTitle("Medientechnik - " + model.getName());
							
				this.repaint();
						
			}
			
			/**
			 * Update of the filter buttons
			 **/
				if (model.blurred()){
					blur.setSelected(true);
				}else{
					blur.setSelected(false);
				}
				if (model.distorted()){
					distort.setSelected(true);
				}else{
					distort.setSelected(false);
				}
				if (model.sharpened()){
					sharpen.setSelected(true);
				}else{
					sharpen.setSelected(false);
				}
					
				if (model.contrasted()){
					contrast.setSelected(true);
				}else{
					contrast.setSelected(false);
				}
				if (model.inverted()){
					invert.setSelected(true);
				}else{
					invert.setSelected(false);
				}
				if (model.bwed()){
					bw.setSelected(true);
				}else{
					bw.setSelected(false);
				}
				if (model.zoomed()){
					zoom.setSelected(true);
				}else{
					zoom.setSelected(false);
				}
				if (model.edgeDetected()){
					edgeDetection.setSelected(true);
				}else{
					edgeDetection.setSelected(false);
				}
				if (model.greened()){
					green.setSelected(true);
				}else{
					green.setSelected(false);
				}
				
/**				
 *Updating the text in the filtertextfield
**/
				
				String text = "";
				if (model.blurred())
					text = text + " Blur ";
				if (model.distorted())
					text = text + " Distort  ";
				if (model.sharpened())
					text = text + " Sharpen ";
				if (model.contrasted())
					text = text + " Contrast ";
				if (model.inverted())
					text = text + " Invert  ";
				if (model.bwed())
					text = text + " B/W ";
				if (model.zoomed())
					text = text + " Zoom ";
				if (model.edgeDetected())
					text = text + " Edge Detection ";
				if (model.greened())
					text = text + " Green ";
				if (model.pointed())
					text = text + " Pointillize ";
				textfieldfilter.setText(text);
				textfieldfilter.setEditable(false);
		}

}

	
