/*
 * File    : OrderTypePanel.java
 * Created : 26-jun-2003 16:30
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
import java.awt.Component;
import java.util.HashMap;
import java.util.Map;

/**
 *
 * @author Francesc Busquets (fbusquets@xtec.cat)
 * @version 13.09.16
 */
public class OrderTypePanel extends javax.swing.JPanel {
    
    Options options;
    protected static final Map<Options, OrderTypePanel> panels=new HashMap<Options, OrderTypePanel>(1);
    
    /** Creates new form OrderTypePanel */
    public OrderTypePanel(Options options) {
        this.options=options;
        initComponents();
    }
    
    /** This method is called from within the constructor to
     * initialize the form.
     * WARNING: Do NOT modify this code. The content of this method is
     * always regenerated by the Form Editor.
     */
    private void initComponents() {//GEN-BEGIN:initComponents
        bGroup = new javax.swing.ButtonGroup();
        orderParagraphsBtn = new javax.swing.JRadioButton();
        orderWordsBtn = new javax.swing.JRadioButton();
        amongstParChk = new javax.swing.JCheckBox();

        setLayout(new javax.swing.BoxLayout(this, javax.swing.BoxLayout.Y_AXIS));

        orderParagraphsBtn.setText(options.getMsg("edit_text_act_orderParagraphs"));
        bGroup.add(orderParagraphsBtn);
        orderParagraphsBtn.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                orderParagraphsBtnActionPerformed(evt);
            }
        });

        add(orderParagraphsBtn);

        orderWordsBtn.setText(options.getMsg("edit_text_act_orderWords"));
        bGroup.add(orderWordsBtn);
        orderWordsBtn.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                orderWordsBtnActionPerformed(evt);
            }
        });

        add(orderWordsBtn);

        amongstParChk.setText(options.getMsg("edit_text_act_order_amongstPar"));
        amongstParChk.setEnabled(false);
        add(amongstParChk);

    }//GEN-END:initComponents

    private void orderParagraphsBtnActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_orderParagraphsBtnActionPerformed

        amongstParChk.setEnabled(!orderParagraphsBtn.isSelected());
        
    }//GEN-LAST:event_orderParagraphsBtnActionPerformed

    private void orderWordsBtnActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_orderWordsBtnActionPerformed

        amongstParChk.setEnabled(orderWordsBtn.isSelected());
        
    }//GEN-LAST:event_orderWordsBtnActionPerformed
    
    
    // Variables declaration - do not modify//GEN-BEGIN:variables
    private javax.swing.JRadioButton orderWordsBtn;
    private javax.swing.JCheckBox amongstParChk;
    private javax.swing.ButtonGroup bGroup;
    private javax.swing.JRadioButton orderParagraphsBtn;
    // End of variables declaration//GEN-END:variables
    
    public static boolean editOrder(Order ord, Options options, Component parent){
        OrderTypePanel otp=panels.get(options);
        if(otp==null){
            otp=new OrderTypePanel(options);
            panels.put(options, otp);
        }
        boolean p=(ord.type==Order.ORDER_PARAGRAPHS);
        otp.orderParagraphsBtn.setSelected(p);
        otp.orderWordsBtn.setSelected(!p);
        otp.amongstParChk.setSelected(ord.amongParagraphs);
        otp.amongstParChk.setEnabled(!p);
        boolean result=options.getMessages().showInputDlg(parent, otp, "edit_text_act_type_title");
        if(result){
            ord.type=otp.orderParagraphsBtn.isSelected() ? Order.ORDER_PARAGRAPHS : Order.ORDER_WORDS;
            ord.amongParagraphs=otp.amongstParChk.isSelected();
        }
        return result;
    }
    
}