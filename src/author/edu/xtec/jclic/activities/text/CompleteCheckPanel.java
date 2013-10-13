/*
 * File    : FillInBlanksOptionsPanel.java
 * Created : 25-jun-2003 17:48
 * By      : fbusquets
 *
 * JClic - Authoring and playing system for educational activities
 *
 * Copyright (C) 2000 - 2005 Francesc Busquets & Departament
 * d'Educacio de la Generalitat de Catalunya
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details (see the LICENSE file).
 */

package edu.xtec.jclic.activities.text;

import edu.xtec.util.Options;

/**
 *
 * @author Francesc Busquets (fbusquets@xtec.cat)
 * @version 1.0
 */
public class CompleteCheckPanel extends javax.swing.JPanel {
    
    Options options;
    BasicEvaluatorPanel basicPanel;
    ComplexEvaluatorPanel complexPanel;    
    CheckOptionsPanel optionsPanel;
    
    /** Creates new form FillInBlanksOptionsPanel */
    public CompleteCheckPanel(Options options) {
        this.options=options;
        initComponents();
        optionsPanel=(CheckOptionsPanel)m_optionsPanel;
        basicPanel=(BasicEvaluatorPanel)m_basicPanel;
        complexPanel=(ComplexEvaluatorPanel)m_complexPanel;    
    }
    
    /** This method is called from within the constructor to
     * initialize the form.
     * WARNING: Do NOT modify this code. The content of this method is
     * always regenerated by the Form Editor.
     */
    private void initComponents() {//GEN-BEGIN:initComponents
        java.awt.GridBagConstraints gridBagConstraints;

        m_optionsPanel = new CheckOptionsPanel(options);
        m_basicPanel = new BasicEvaluatorPanel(options);
        m_complexPanel = new ComplexEvaluatorPanel(options);

        setLayout(new java.awt.GridBagLayout());

        gridBagConstraints = new java.awt.GridBagConstraints();
        gridBagConstraints.gridwidth = java.awt.GridBagConstraints.REMAINDER;
        gridBagConstraints.fill = java.awt.GridBagConstraints.BOTH;
        gridBagConstraints.anchor = java.awt.GridBagConstraints.WEST;
        gridBagConstraints.weightx = 1.0;
        add(m_optionsPanel, gridBagConstraints);

        gridBagConstraints = new java.awt.GridBagConstraints();
        gridBagConstraints.gridwidth = java.awt.GridBagConstraints.REMAINDER;
        gridBagConstraints.fill = java.awt.GridBagConstraints.BOTH;
        gridBagConstraints.anchor = java.awt.GridBagConstraints.WEST;
        add(m_basicPanel, gridBagConstraints);

        gridBagConstraints = new java.awt.GridBagConstraints();
        gridBagConstraints.gridwidth = java.awt.GridBagConstraints.REMAINDER;
        gridBagConstraints.fill = java.awt.GridBagConstraints.BOTH;
        gridBagConstraints.anchor = java.awt.GridBagConstraints.WEST;
        add(m_complexPanel, gridBagConstraints);

    }//GEN-END:initComponents
    
    
    public void setOptions(Complete comp){
        optionsPanel.setOptions(comp);
        if(comp.ev instanceof BasicEvaluator)
            basicPanel.setEvaluator((BasicEvaluator)comp.ev);
        if(comp.ev instanceof ComplexEvaluator)
            complexPanel.setEvaluator((ComplexEvaluator)comp.ev);        
    }
    
    public void collectData(Complete comp){
        optionsPanel.collectData(comp);
        if(comp.ev instanceof BasicEvaluator)
            basicPanel.collectData((BasicEvaluator)comp.ev);
        if(comp.ev instanceof ComplexEvaluator)
            complexPanel.collectData((ComplexEvaluator)comp.ev);
    }    
    
    
    // Variables declaration - do not modify//GEN-BEGIN:variables
    private javax.swing.JPanel m_basicPanel;
    private javax.swing.JPanel m_complexPanel;
    private javax.swing.JPanel m_optionsPanel;
    // End of variables declaration//GEN-END:variables
    
}