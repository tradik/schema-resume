<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" encoding="UTF-8" indent="yes"/>
  
  <!-- Named template to build field path dynamically -->
  <xsl:template name="getFieldPath">
    <xsl:param name="node" select="."/>
    <xsl:for-each select="$node/ancestor-or-self::*[parent::Schema_Resume_v1.1.0 or parent::item]">
      <xsl:if test="position() > 1">.</xsl:if>
      <xsl:choose>
        <xsl:when test="local-name() = 'item'">
          <xsl:value-of select="count(preceding-sibling::item)"/>
        </xsl:when>
        <xsl:otherwise>
          <xsl:value-of select="local-name()"/>
        </xsl:otherwise>
      </xsl:choose>
    </xsl:for-each>
  </xsl:template>
  
  <!-- Template for wrapping text content with data-field -->
  <xsl:template name="wrapWithDataField">
    <xsl:param name="content"/>
    <xsl:param name="fieldPath"/>
    <xsl:choose>
      <xsl:when test="$fieldPath != ''">
        <span data-field="{$fieldPath}">
          <xsl:copy-of select="$content"/>
        </span>
      </xsl:when>
      <xsl:otherwise>
        <xsl:copy-of select="$content"/>
      </xsl:otherwise>
    </xsl:choose>
  </xsl:template>
  
  <!-- Rest of your template here... -->
  <xsl:template match="/">
    <html>
      <head>
        <style>
          /* Same styles as before */
        </style>
      </head>
      <body>
        <!-- Your resume content with dynamic field paths -->
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
