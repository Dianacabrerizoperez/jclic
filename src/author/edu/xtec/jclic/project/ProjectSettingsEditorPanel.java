/*
 * File    : ProjectSettingsEditorPanel.java
 * Created : 27-feb-2004 10:33
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

package edu.xtec.jclic.project;

import edu.xtec.jclic.beans.EventSoundsButton;
import edu.xtec.jclic.beans.TextListEditor;
import edu.xtec.jclic.edit.Editor;
import edu.xtec.jclic.edit.EditorPanel;
import edu.xtec.jclic.media.EventSounds;
import edu.xtec.util.Messages;
import edu.xtec.util.Options;
import edu.xtec.util.StrUtils;
import java.util.ArrayList;
import java.util.List;
import javax.swing.JComponent;
import javax.swing.JList;
import javax.swing.JScrollPane;
import javax.swing.ScrollPaneConstants;
import javax.swing.SwingUtilities;

/**
 *
 * @author Francesc Busquets (fbusquets@xtec.cat)
 * @version 13.10.29
 */
public class ProjectSettingsEditorPanel extends EditorPanel {
    
    /** Creates new form JClicProjectEditorPanel */
    public ProjectSettingsEditorPanel(Options options) {
        super(options);
        initComponents();
        evSoundsBtn.setOptions(options);
        postInit(250, false, false);        
        setEnabled(false);
    }
    
    /** This method is called from within the constructor to
     * initialize the form.
     * WARNING: Do NOT modify this code. The content of this method is
     * always regenerated by the Form Editor.
     */
    private void initComponents() {//GEN-BEGIN:initComponents
        javax.swing.JLabel areaLb;
        javax.swing.JLabel authorLb;
        javax.swing.JLabel descLb;
        javax.swing.JScrollPane descScroll;
        javax.swing.JLabel descriptorslLb;
        javax.swing.JLabel evSoundsLb;
        java.awt.GridBagConstraints gridBagConstraints;
        javax.swing.JLabel langLb;
        javax.swing.JLabel levelLb;
        javax.swing.JLabel orgLb;
        javax.swing.JLabel revLb;
        javax.swing.JLabel skinLb;
        javax.swing.JLabel spacer;
        javax.swing.JLabel titleLb;

        scroll = new javax.swing.JScrollPane();
        mainPanel = new javax.swing.JPanel();
        descrPanel = new edu.xtec.jclic.beans.RollPanel();
        titleLb = new javax.swing.JLabel();
        titleText = new javax.swing.JTextField();
        descLb = new javax.swing.JLabel();
        descScroll = new javax.swing.JScrollPane();
        descText = new javax.swing.JTextPane();
        authPanel = new edu.xtec.jclic.beans.RollPanel();
        authorLb = new javax.swing.JLabel();
        authorListEditor = new TextListEditor(options){
            protected Object editItem(Object currentValue, boolean newValue){
                return editAuthor(currentValue, newValue);
            }
        };
        orgLb = new javax.swing.JLabel();
        orgListEditor = new TextListEditor(options){
            protected Object editItem(Object currentValue, boolean newValue){
                return editOrg(currentValue, newValue);
            }
        };
        revLb = new javax.swing.JLabel();
        revListEditor = new TextListEditor(options){
            protected Object editItem(Object currentValue, boolean newValue){
                return editRevision(currentValue, newValue);
            }
        };
        descPanel = new edu.xtec.jclic.beans.RollPanel();
        levelLb = new javax.swing.JLabel();
        levelText = new javax.swing.JTextField();
        areaLb = new javax.swing.JLabel();
        areaText = new javax.swing.JTextField();
        descriptorslLb = new javax.swing.JLabel();
        descriptorsText = new javax.swing.JTextField();
        langLb = new javax.swing.JLabel();
        langListEditor = new TextListEditor(options){
            protected Object editItem(Object currentValue, boolean newValue){
                return editLanguage(currentValue, newValue);
            }
        };
        uiPanel = new edu.xtec.jclic.beans.RollPanel();
        skinLb = new javax.swing.JLabel();
        skinCombo = new javax.swing.JComboBox(edu.xtec.jclic.skins.Skin.getSystemSkinList(false));
        skinCombo.setSelectedItem(null);
        evSoundsLb = new javax.swing.JLabel();
        evSoundsBtn = new edu.xtec.jclic.beans.EventSoundsButton();
        spacer = new javax.swing.JLabel();

        setLayout(new java.awt.BorderLayout());

        mainPanel.setLayout(new java.awt.GridBagLayout());

        descrPanel.getMainPanel().setLayout(new java.awt.GridBagLayout());

        descrPanel.setTitle(options.getMsg("edit_project_description_block"));
        titleLb.setLabelFor(titleText);
        titleLb.setText(options.getMsg("edit_project_title"));
        gridBagConstraints = new java.awt.GridBagConstraints();
        gridBagConstraints.anchor = java.awt.GridBagConstraints.EAST;
        gridBagConstraints.insets = new java.awt.Insets(3, 3, 3, 3);
        descrPanel.getMainPanel().add(titleLb, gridBagConstraints);

        titleText.setToolTipText(options.getMsg("edit_project_title_tooltip"));
        titleText.setPreferredSize(new java.awt.Dimension(400, 21));
        titleText.getDocument().addDocumentListener(this);
        gridBagConstraints = new java.awt.GridBagConstraints();
        gridBagConstraints.gridwidth = java.awt.GridBagConstraints.REMAINDER;
        gridBagConstraints.anchor = java.awt.GridBagConstraints.WEST;
        gridBagConstraints.weightx = 1.0;
        gridBagConstraints.insets = new java.awt.Insets(3, 3, 3, 3);
        descrPanel.getMainPanel().add(titleText, gridBagConstraints);

        descLb.setText(options.getMsg("edit_project_description"));
        gridBagConstraints = new java.awt.GridBagConstraints();
        gridBagConstraints.anchor = java.awt.GridBagConstraints.NORTHEAST;
        gridBagConstraints.insets = new java.awt.Insets(3, 3, 3, 3);
        descrPanel.getMainPanel().add(descLb, gridBagConstraints);

        descScroll.setHorizontalScrollBarPolicy(ScrollPaneConstants.HORIZONTAL_SCROLLBAR_NEVER);
        descScroll.setPreferredSize(new java.awt.Dimension(400, 100));
        descText.setToolTipText(options.getMsg("edit_project_description_tooltip"));
        descText.getDocument().addDocumentListener(this);
        descScroll.setViewportView(descText);

        gridBagConstraints = new java.awt.GridBagConstraints();
        gridBagConstraints.gridwidth = java.awt.GridBagConstraints.REMAINDER;
        gridBagConstraints.anchor = java.awt.GridBagConstraints.NORTHWEST;
        gridBagConstraints.insets = new java.awt.Insets(3, 3, 3, 3);
        descrPanel.getMainPanel().add(descScroll, gridBagConstraints);

        gridBagConstraints = new java.awt.GridBagConstraints();
        gridBagConstraints.gridwidth = java.awt.GridBagConstraints.REMAINDER;
        gridBagConstraints.fill = java.awt.GridBagConstraints.HORIZONTAL;
        gridBagConstraints.insets = new java.awt.Insets(3, 3, 3, 3);
        mainPanel.add(descrPanel, gridBagConstraints);

        authPanel.getMainPanel().setLayout(new java.awt.GridBagLayout());

        authPanel.setTitle(options.getMsg("edit_project_author_group"));
        authorLb.setLabelFor(authorListEditor);
        authorLb.setText(options.getMsg("edit_project_authors"));
        gridBagConstraints = new java.awt.GridBagConstraints();
        gridBagConstraints.anchor = java.awt.GridBagConstraints.NORTHEAST;
        gridBagConstraints.insets = new java.awt.Insets(3, 3, 3, 3);
        authPanel.getMainPanel().add(authorLb, gridBagConstraints);

        authorListEditor.setToolTipText(options.getMsg("edit_project_authors_tooltip"));
        authorListEditor.setPreferredSize(new java.awt.Dimension(400, 80));
        authorListEditor.addPropertyChangeListener(TextListEditor.PROP_LIST, this);
        gridBagConstraints = new java.awt.GridBagConstraints();
        gridBagConstraints.gridwidth = java.awt.GridBagConstraints.REMAINDER;
        gridBagConstraints.anchor = java.awt.GridBagConstraints.NORTHWEST;
        gridBagConstraints.weightx = 1.0;
        authPanel.getMainPanel().add(authorListEditor, gridBagConstraints);

        orgLb.setLabelFor(orgListEditor);
        orgLb.setText(options.getMsg("edit_project_org"));
        gridBagConstraints = new java.awt.GridBagConstraints();
        gridBagConstraints.anchor = java.awt.GridBagConstraints.NORTHEAST;
        gridBagConstraints.insets = new java.awt.Insets(3, 3, 3, 3);
        authPanel.getMainPanel().add(orgLb, gridBagConstraints);

        orgListEditor.setToolTipText(options.getMsg("edit_project_org_tooltip"));
        orgListEditor.setPreferredSize(new java.awt.Dimension(400, 80));
        orgListEditor.addPropertyChangeListener(TextListEditor.PROP_LIST, this);
        gridBagConstraints = new java.awt.GridBagConstraints();
        gridBagConstraints.gridwidth = java.awt.GridBagConstraints.REMAINDER;
        gridBagConstraints.anchor = java.awt.GridBagConstraints.NORTHWEST;
        authPanel.getMainPanel().add(orgListEditor, gridBagConstraints);

        revLb.setLabelFor(revListEditor);
        revLb.setText(options.getMsg("edit_project_rev"));
        gridBagConstraints = new java.awt.GridBagConstraints();
        gridBagConstraints.anchor = java.awt.GridBagConstraints.NORTHEAST;
        gridBagConstraints.insets = new java.awt.Insets(3, 3, 3, 3);
        authPanel.getMainPanel().add(revLb, gridBagConstraints);

        revListEditor.setToolTipText(options.getMsg("edit_project_rev_tooltip"));
        revListEditor.setPreferredSize(new java.awt.Dimension(400, 80));
        revListEditor.addPropertyChangeListener(TextListEditor.PROP_LIST, this);
        gridBagConstraints = new java.awt.GridBagConstraints();
        gridBagConstraints.gridwidth = java.awt.GridBagConstraints.REMAINDER;
        gridBagConstraints.anchor = java.awt.GridBagConstraints.NORTHWEST;
        authPanel.getMainPanel().add(revListEditor, gridBagConstraints);

        gridBagConstraints = new java.awt.GridBagConstraints();
        gridBagConstraints.gridwidth = java.awt.GridBagConstraints.REMAINDER;
        gridBagConstraints.fill = java.awt.GridBagConstraints.HORIZONTAL;
        gridBagConstraints.weightx = 1.0;
        gridBagConstraints.insets = new java.awt.Insets(3, 3, 3, 3);
        mainPanel.add(authPanel, gridBagConstraints);

        descPanel.getMainPanel().setLayout(new java.awt.GridBagLayout());

        descPanel.setTitle(options.getMsg("edit_project_descriptors_block"));
        levelLb.setLabelFor(levelText);
        levelLb.setText(options.getMsg("edit_project_level"));
        gridBagConstraints = new java.awt.GridBagConstraints();
        gridBagConstraints.anchor = java.awt.GridBagConstraints.EAST;
        gridBagConstraints.insets = new java.awt.Insets(3, 3, 3, 3);
        descPanel.getMainPanel().add(levelLb, gridBagConstraints);

        levelText.setToolTipText(options.getMsg("edit_project_level_tooltip"));
        levelText.setPreferredSize(new java.awt.Dimension(400, 21));
        levelText.getDocument().addDocumentListener(this);
        gridBagConstraints = new java.awt.GridBagConstraints();
        gridBagConstraints.gridwidth = java.awt.GridBagConstraints.REMAINDER;
        gridBagConstraints.anchor = java.awt.GridBagConstraints.WEST;
        gridBagConstraints.weightx = 1.0;
        gridBagConstraints.insets = new java.awt.Insets(3, 3, 3, 3);
        descPanel.getMainPanel().add(levelText, gridBagConstraints);

        areaLb.setLabelFor(areaText);
        areaLb.setText(options.getMsg("edit_project_area"));
        gridBagConstraints = new java.awt.GridBagConstraints();
        gridBagConstraints.anchor = java.awt.GridBagConstraints.EAST;
        gridBagConstraints.insets = new java.awt.Insets(3, 3, 3, 3);
        descPanel.getMainPanel().add(areaLb, gridBagConstraints);

        areaText.setToolTipText(options.getMsg("edit_project_area_tooltip"));
        areaText.setPreferredSize(new java.awt.Dimension(400, 21));
        areaText.getDocument().addDocumentListener(this);
        gridBagConstraints = new java.awt.GridBagConstraints();
        gridBagConstraints.gridwidth = java.awt.GridBagConstraints.REMAINDER;
        gridBagConstraints.anchor = java.awt.GridBagConstraints.WEST;
        gridBagConstraints.weightx = 1.0;
        gridBagConstraints.insets = new java.awt.Insets(3, 3, 3, 3);
        descPanel.getMainPanel().add(areaText, gridBagConstraints);

        descriptorslLb.setLabelFor(descriptorsText);
        descriptorslLb.setText(options.getMsg("edit_project_descriptors"));
        gridBagConstraints = new java.awt.GridBagConstraints();
        gridBagConstraints.anchor = java.awt.GridBagConstraints.EAST;
        gridBagConstraints.insets = new java.awt.Insets(3, 3, 3, 3);
        descPanel.getMainPanel().add(descriptorslLb, gridBagConstraints);

        descriptorsText.setToolTipText(options.getMsg("edit_project_descriptors_tooltip"));
        descriptorsText.setPreferredSize(new java.awt.Dimension(400, 21));
        descriptorsText.getDocument().addDocumentListener(this);
        gridBagConstraints = new java.awt.GridBagConstraints();
        gridBagConstraints.gridwidth = java.awt.GridBagConstraints.REMAINDER;
        gridBagConstraints.anchor = java.awt.GridBagConstraints.WEST;
        gridBagConstraints.weightx = 1.0;
        gridBagConstraints.insets = new java.awt.Insets(3, 3, 3, 3);
        descPanel.getMainPanel().add(descriptorsText, gridBagConstraints);

        langLb.setLabelFor(langListEditor);
        langLb.setText(options.getMsg("edit_project_languages"));
        gridBagConstraints = new java.awt.GridBagConstraints();
        gridBagConstraints.anchor = java.awt.GridBagConstraints.NORTHEAST;
        gridBagConstraints.insets = new java.awt.Insets(3, 3, 3, 3);
        descPanel.getMainPanel().add(langLb, gridBagConstraints);

        langListEditor.setToolTipText(options.getMsg("edit_project_languages_tooltip"));
        langListEditor.setPreferredSize(new java.awt.Dimension(200, 80));
        langListEditor.addPropertyChangeListener(TextListEditor.PROP_LIST, this);
        gridBagConstraints = new java.awt.GridBagConstraints();
        gridBagConstraints.gridwidth = java.awt.GridBagConstraints.REMAINDER;
        gridBagConstraints.anchor = java.awt.GridBagConstraints.NORTHWEST;
        descPanel.getMainPanel().add(langListEditor, gridBagConstraints);

        gridBagConstraints = new java.awt.GridBagConstraints();
        gridBagConstraints.gridwidth = java.awt.GridBagConstraints.REMAINDER;
        gridBagConstraints.fill = java.awt.GridBagConstraints.HORIZONTAL;
        gridBagConstraints.weightx = 1.0;
        gridBagConstraints.insets = new java.awt.Insets(3, 3, 3, 3);
        mainPanel.add(descPanel, gridBagConstraints);

        uiPanel.getMainPanel().setLayout(new java.awt.GridBagLayout());

        uiPanel.setTitle(options.getMsg("edit_project_ui_block"));
        skinLb.setLabelFor(skinCombo);
        skinLb.setText(options.getMsg("settings_skin"));
        gridBagConstraints = new java.awt.GridBagConstraints();
        gridBagConstraints.anchor = java.awt.GridBagConstraints.EAST;
        gridBagConstraints.insets = new java.awt.Insets(3, 3, 3, 3);
        uiPanel.getMainPanel().add(skinLb, gridBagConstraints);

        skinCombo.setToolTipText(options.getMsg("settings_skin_tooltip"));
        skinCombo.setEditable(true);
        skinCombo.addActionListener(this);
        gridBagConstraints = new java.awt.GridBagConstraints();
        gridBagConstraints.gridwidth = java.awt.GridBagConstraints.REMAINDER;
        gridBagConstraints.anchor = java.awt.GridBagConstraints.WEST;
        gridBagConstraints.weightx = 1.0;
        gridBagConstraints.insets = new java.awt.Insets(3, 3, 3, 3);
        uiPanel.getMainPanel().add(skinCombo, gridBagConstraints);

        evSoundsLb.setLabelFor(revListEditor);
        evSoundsLb.setText(options.getMsg("edit_project_evsounds"));
        gridBagConstraints = new java.awt.GridBagConstraints();
        gridBagConstraints.anchor = java.awt.GridBagConstraints.NORTHEAST;
        gridBagConstraints.insets = new java.awt.Insets(3, 3, 3, 3);
        uiPanel.getMainPanel().add(evSoundsLb, gridBagConstraints);

        evSoundsBtn.setToolTipText(options.getMsg("edit_project_evsounds_tooltip"));
        evSoundsBtn.addPropertyChangeListener(EventSoundsButton.PROP_EVSND_NAME, this);
        gridBagConstraints = new java.awt.GridBagConstraints();
        gridBagConstraints.gridwidth = java.awt.GridBagConstraints.REMAINDER;
        gridBagConstraints.anchor = java.awt.GridBagConstraints.WEST;
        gridBagConstraints.insets = new java.awt.Insets(3, 3, 3, 3);
        uiPanel.getMainPanel().add(evSoundsBtn, gridBagConstraints);

        gridBagConstraints = new java.awt.GridBagConstraints();
        gridBagConstraints.gridwidth = java.awt.GridBagConstraints.REMAINDER;
        gridBagConstraints.fill = java.awt.GridBagConstraints.HORIZONTAL;
        gridBagConstraints.weightx = 1.0;
        gridBagConstraints.insets = new java.awt.Insets(3, 3, 3, 3);
        mainPanel.add(uiPanel, gridBagConstraints);

        gridBagConstraints = new java.awt.GridBagConstraints();
        gridBagConstraints.gridwidth = java.awt.GridBagConstraints.REMAINDER;
        gridBagConstraints.gridheight = java.awt.GridBagConstraints.REMAINDER;
        gridBagConstraints.fill = java.awt.GridBagConstraints.VERTICAL;
        gridBagConstraints.weighty = 1.0;
        mainPanel.add(spacer, gridBagConstraints);

        scroll.setViewportView(mainPanel);

        add(scroll, java.awt.BorderLayout.CENTER);

    }//GEN-END:initComponents

    public boolean checkIfEditorValid(Editor e) {
        return (e instanceof ProjectSettingsEditor);
    }    
    
    protected ProjectSettingsEditor getProjectSettingsEditor(){
        return (ProjectSettingsEditor)getEditor();
    }
        
    protected ProjectSettings getProjectSettings(){
        ProjectSettings result=null;
        ProjectSettingsEditor pse=getProjectSettingsEditor();
        if(pse!=null)
            result=pse.getProjectSettings();
        return result;
    }
    
    protected void fillData() {
        ProjectSettings ps=getProjectSettings();
        JClicProjectEditor prjed=(ps==null ? null : getProjectSettingsEditor().getProjectEditor());
        
        if(prjed!=null){
            evSoundsBtn.setMediaBagEditor(prjed.getMediaBagEditor());
        }
        evSoundsBtn.setEventSounds(ps==null ? null : ps.eventSounds);
        
        titleText.setText(ps==null || ps.title==null ? options.getMsg("UNNAMED") : ps.title);
        descText.setText(ps==null  ? "" : StrUtils.secureString(ps.description));
        areaText.setText(ps==null ? "" : StrUtils.secureString(ps.area));
        levelText.setText(ps==null ? "" : StrUtils.secureString(ps.level));
        descriptorsText.setText(ps==null ? "" : StrUtils.secureString(ps.descriptors));
        skinCombo.setSelectedItem(ps==null ? null : ps.skinFileName);        
        
        List<Object> v=new ArrayList<Object>();
        if(ps!=null && ps.languages!=null){
            for(int i=0; i<ps.languages.length; i++){
                String code=(String)Messages.getNamesToCodes().get(ps.languages[i].toLowerCase());
                if(code!=null)
                    v.add(Messages.getDescriptiveLanguageCode(code));
                else
                    v.add(ps.languages[i]);
            }
        }        
        langListEditor.setListData(v);
        
        v.clear();
        if(ps!=null && ps.authors!=null){
            for(Author a: ps.authors)
                v.add(a);
        }
        authorListEditor.setListData(v);
        
        v.clear();
        if(ps!=null && ps.organizations!=null){
            for(Organization o : ps.organizations)
                v.add(o);
        }
        orgListEditor.setListData(v);
        
        v.clear();
        if(ps!=null && ps.revisions!=null){
            for(Revision r : ps.revisions)
                v.add(r);
        }
        revListEditor.setListData(v);        
    }    
    
    @Override
    public void setEnabled(boolean enabled){
        super.setEnabled(enabled);
        evSoundsBtn.setEnabled(enabled);        
        titleText.setEnabled(enabled);
        descText.setEnabled(enabled);
        areaText.setEnabled(enabled);
        levelText.setEnabled(enabled);
        descriptorsText.setEnabled(enabled);
        skinCombo.setEnabled(enabled);                
        langListEditor.setEnabled(enabled);
        authorListEditor.setEnabled(enabled);
        orgListEditor.setEnabled(enabled);
        revListEditor.setEnabled(enabled);
    }
    

    /*
    public boolean isModified(){
        boolean result=super.isModified();
        ProjectSettings ps=getProjectSettings();
        if(ps!=null && !result){
            result=
            !titleText.getText().equals(ps.title)
            || !descText.getText().equals(ps.description)
            || !areaText.getText().equals(ps.area)
            || !levelText.getText().equals(ps.level)
            || !descriptorsText.getText().equals(ps.descriptors)
            || !Utils.compareObjects(skinCombo.getSelectedItem(), ps.skinFileName)
            || langListEditor.isModified()
            || authorListEditor.isModified()
            || orgListEditor.isModified()
            || revListEditor.isModified()
            || evSoundsBtn.isModified();
        }
        return result;
    }
     */
    
    protected void saveData() {
        ProjectSettings ps=getProjectSettings();
        if(ps!=null){
            ps.title=StrUtils.secureString(titleText.getText(), options.getMsg("UNNAMED"));
            ps.description=StrUtils.nullableString(descText.getText());
            List<Object> v=authorListEditor.getListData();
            ps.authors=(Author[])v.toArray(new Author[v.size()]);
            v=orgListEditor.getListData();
            ps.organizations=(Organization[])v.toArray(new Organization[v.size()]);
            v=revListEditor.getListData();
            ps.revisions=(Revision[])v.toArray(new Revision[v.size()]);            
            ps.level=StrUtils.nullableString(levelText.getText());
            ps.area=StrUtils.nullableString(areaText.getText());            
            ps.descriptors=StrUtils.nullableString(descriptorsText.getText());            
            String[] langs=langListEditor.getTextList();
            ps.languages=new String[langs.length];
            for(int i=0; i<langs.length; i++){
                String ln=langs[i];
                int p=ln.length();
                if(p>5){
                    String code=ln.substring(p-3, p-1);
                    ln=(String)Messages.getNamesToCodes().get(code);
                }
                ps.languages[i]=(ln==null ? langs[i] : ln);            
            }
            ps.skinFileName=StrUtils.nullableString(skinCombo.getSelectedItem());
            
            EventSounds evs=evSoundsBtn.getEventSounds();
            ps.eventSounds=(evs==null ? new EventSounds(null) : evs);
        }       
    }
    
    private static JScrollPane langListPanel;
    private static JList langList;
    private Object editLanguage(final Object currentValue, boolean newValue){
        if(langList==null || langListPanel==null){
            langList=new JList(options.getMessages().getDescriptiveLanguageCodes());
            langListPanel=new JScrollPane(langList);            
        }
        Object result=null;
        if(!newValue && currentValue!=null){
            SwingUtilities.invokeLater(new Runnable(){
                public void run(){
                    langList.setSelectedValue(currentValue, true);                
                }
            });
        } else{
            langList.setSelectedIndex(-1);                
        }
        if(options.getMessages().showInputDlg(
        this, new String[] {"edit_project_languages_select"}
        , null, new JComponent[]{langListPanel}
        , (newValue ? "edit_project_languages_add" : "edit_project_languages_modify"))){
            result=langList.getSelectedValue();
        }
        return result;
    }
    
    
    private AuthorEditPanel authorEditPanel;
    private Object editAuthor(Object currentValue, boolean newValue){
        Author result=null;
        if(authorEditPanel==null)
            authorEditPanel=new AuthorEditPanel(options);
        if(newValue)
            currentValue=null;        
        authorEditPanel.setAuthor((Author)currentValue);
        if(options.getMessages().showInputDlg(
        this, new String[] {"edit_project_author_info"}
        , null, new JComponent[]{authorEditPanel}
        , (newValue ? "edit_project_author_add" : "edit_project_author_edit"))){
            result=authorEditPanel.getAuthor();
            if(result.name.length()<1)
                result=null;
        }
        return result;        
    }
    
    private OrganizationEditPanel organizationEditPanel;
    private Object editOrg(Object currentValue, boolean newValue){
        Organization result=null;
        if(organizationEditPanel==null)
            organizationEditPanel=new OrganizationEditPanel(options);
        if(newValue)
            currentValue=null;        
        organizationEditPanel.setOrganization((Organization)currentValue);
        if(options.getMessages().showInputDlg(
        this, new String[] {"edit_project_org_info"}
        , null, new JComponent[]{organizationEditPanel}
        , (newValue ? "edit_project_org_add" : "edit_project_org_edit"))){
            result=organizationEditPanel.getOrganization();
            if(result.name.length()<1)
                result=null;
        }
        return result;        
    }
    
    private RevisionEditPanel revisionEditPanel;
    private Object editRevision(Object currentValue, boolean newValue){
        Revision result=null;
        if(revisionEditPanel==null)
            revisionEditPanel=new RevisionEditPanel(options);
        if(newValue)
            currentValue=null;        
        revisionEditPanel.setRevision((Revision)currentValue);
        if(options.getMessages().showInputDlg(
        this, new String[] {"edit_project_rev_info"}
        , null, new JComponent[]{revisionEditPanel}
        , (newValue ? "edit_project_rev_add" : "edit_project_rev_edit"))){
            result=revisionEditPanel.getRevision();
            if(result!=null && result.description.length()<1)
                result=null;
        }
        return result;
    }    
        
    // Variables declaration - do not modify//GEN-BEGIN:variables
    private javax.swing.JTextField areaText;
    private edu.xtec.jclic.beans.RollPanel authPanel;
    private edu.xtec.jclic.beans.TextListEditor authorListEditor;
    private edu.xtec.jclic.beans.RollPanel descPanel;
    private javax.swing.JTextPane descText;
    private edu.xtec.jclic.beans.RollPanel descrPanel;
    private javax.swing.JTextField descriptorsText;
    private edu.xtec.jclic.beans.EventSoundsButton evSoundsBtn;
    private edu.xtec.jclic.beans.TextListEditor langListEditor;
    private javax.swing.JTextField levelText;
    private javax.swing.JPanel mainPanel;
    private edu.xtec.jclic.beans.TextListEditor orgListEditor;
    private edu.xtec.jclic.beans.TextListEditor revListEditor;
    private javax.swing.JScrollPane scroll;
    private javax.swing.JComboBox skinCombo;
    private javax.swing.JTextField titleText;
    private edu.xtec.jclic.beans.RollPanel uiPanel;
    // End of variables declaration//GEN-END:variables
    
}
