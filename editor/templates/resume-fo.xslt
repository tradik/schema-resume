<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" 
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:fo="http://www.w3.org/1999/XSL/Format"
  xmlns:xs="http://www.w3.org/2001/XMLSchema"
  exclude-result-prefixes="xs">
  
  <xsl:output method="xml" indent="yes"/>
  
  <xsl:template match="/">
    <fo:root xmlns:fo="http://www.w3.org/1999/XSL/Format">
      
      <!-- Page Layout (must come before declarations per XSL-FO spec) -->
      <fo:layout-master-set>
        <fo:simple-page-master master-name="A4" page-height="297mm" page-width="210mm"
                               margin-top="15mm" margin-bottom="15mm" 
                               margin-left="15mm" margin-right="15mm">
          <fo:region-body margin-top="0mm" margin-bottom="10mm"/>
          <fo:region-after extent="10mm"/>
        </fo:simple-page-master>
      </fo:layout-master-set>
      
      <!-- XMP Metadata Declarations -->
      <fo:declarations>
        <x:xmpmeta xmlns:x="adobe:ns:meta/">
          <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">
            <!-- Dublin Core Metadata -->
            <rdf:Description rdf:about="" xmlns:dc="http://purl.org/dc/elements/1.1/">
              <dc:format>application/pdf</dc:format>
              <dc:creator>
                <rdf:Seq>
                  <rdf:li><xsl:value-of select="Schema_Resume_v1.1.0/basics/name"/></rdf:li>
                </rdf:Seq>
              </dc:creator>
              <dc:title>
                <rdf:Alt>
                  <rdf:li xml:lang="x-default">Resume - <xsl:value-of select="Schema_Resume_v1.1.0/basics/name"/></rdf:li>
                </rdf:Alt>
              </dc:title>
              <dc:description>
                <rdf:Alt>
                  <rdf:li xml:lang="x-default"><xsl:value-of select="Schema_Resume_v1.1.0/basics/summary"/></rdf:li>
                </rdf:Alt>
              </dc:description>
              <dc:subject>
                <rdf:Bag>
                  <rdf:li><xsl:value-of select="Schema_Resume_v1.1.0/basics/label"/></rdf:li>
                </rdf:Bag>
              </dc:subject>
            </rdf:Description>
            
            <!-- XMP Basic Metadata -->
            <rdf:Description rdf:about="" xmlns:xmp="http://ns.adobe.com/xap/1.0/">
              <xmp:CreatorTool>CV-XSLT Resume Generator with Apache FOP</xmp:CreatorTool>
              <xmp:CreateDate>
                <xsl:choose>
                  <xsl:when test="Schema_Resume_v1.1.0/meta/lastModified and string-length(Schema_Resume_v1.1.0/meta/lastModified) &gt;= 10">
                    <xsl:value-of select="concat(substring(Schema_Resume_v1.1.0/meta/lastModified, 1, 10), 'T00:00:00Z')"/>
                  </xsl:when>
                  <xsl:otherwise>2025-01-01T00:00:00Z</xsl:otherwise>
                </xsl:choose>
              </xmp:CreateDate>
              <xmp:ModifyDate>
                <xsl:choose>
                  <xsl:when test="Schema_Resume_v1.1.0/meta/lastModified and string-length(Schema_Resume_v1.1.0/meta/lastModified) &gt;= 10">
                    <xsl:value-of select="concat(substring(Schema_Resume_v1.1.0/meta/lastModified, 1, 10), 'T00:00:00Z')"/>
                  </xsl:when>
                  <xsl:otherwise>2025-01-01T00:00:00Z</xsl:otherwise>
                </xsl:choose>
              </xmp:ModifyDate>
            </rdf:Description>
            
            <!-- PDF Metadata -->
            <rdf:Description rdf:about="" xmlns:pdf="http://ns.adobe.com/pdf/1.3/">
              <pdf:Producer>Apache FOP with CV-XSLT</pdf:Producer>
              <pdf:Keywords><xsl:value-of select="Schema_Resume_v1.1.0/basics/label"/></pdf:Keywords>
            </rdf:Description>
            
            <!-- PDF/A Identification -->
            <rdf:Description rdf:about="" xmlns:pdfaid="http://www.aiim.org/pdfa/ns/id/">
              <pdfaid:part>3</pdfaid:part>
              <pdfaid:conformance>B</pdfaid:conformance>
            </rdf:Description>
            
            <!-- PDF/A Extension Schemas for custom namespaces -->
            <rdf:Description rdf:about="" xmlns:pdfaExtension="http://www.aiim.org/pdfa/ns/extension/" xmlns:pdfaSchema="http://www.aiim.org/pdfa/ns/schema#" xmlns:pdfaProperty="http://www.aiim.org/pdfa/ns/property#">
              <pdfaExtension:schemas>
                <rdf:Bag>
                  <!-- Schema.org Extension Schema -->
                  <rdf:li rdf:parseType="Resource">
                    <pdfaSchema:schema>Schema.org</pdfaSchema:schema>
                    <pdfaSchema:namespaceURI>http://schema.org/</pdfaSchema:namespaceURI>
                    <pdfaSchema:prefix>schema</pdfaSchema:prefix>
                    <pdfaSchema:property>
                      <rdf:Seq>
                        <rdf:li rdf:parseType="Resource">
                          <pdfaProperty:name>email</pdfaProperty:name>
                          <pdfaProperty:valueType>Text</pdfaProperty:valueType>
                          <pdfaProperty:category>external</pdfaProperty:category>
                          <pdfaProperty:description>Email address</pdfaProperty:description>
                        </rdf:li>
                        <rdf:li rdf:parseType="Resource">
                          <pdfaProperty:name>telephone</pdfaProperty:name>
                          <pdfaProperty:valueType>Text</pdfaProperty:valueType>
                          <pdfaProperty:category>external</pdfaProperty:category>
                          <pdfaProperty:description>Telephone number</pdfaProperty:description>
                        </rdf:li>
                        <rdf:li rdf:parseType="Resource">
                          <pdfaProperty:name>url</pdfaProperty:name>
                          <pdfaProperty:valueType>URI</pdfaProperty:valueType>
                          <pdfaProperty:category>external</pdfaProperty:category>
                          <pdfaProperty:description>URL of personal website</pdfaProperty:description>
                        </rdf:li>
                        <rdf:li rdf:parseType="Resource">
                          <pdfaProperty:name>jobTitle</pdfaProperty:name>
                          <pdfaProperty:valueType>Text</pdfaProperty:valueType>
                          <pdfaProperty:category>external</pdfaProperty:category>
                          <pdfaProperty:description>Job title or professional role</pdfaProperty:description>
                        </rdf:li>
                        <rdf:li rdf:parseType="Resource">
                          <pdfaProperty:name>address</pdfaProperty:name>
                          <pdfaProperty:valueType>Text</pdfaProperty:valueType>
                          <pdfaProperty:category>external</pdfaProperty:category>
                          <pdfaProperty:description>Physical address or location</pdfaProperty:description>
                        </rdf:li>
                      </rdf:Seq>
                    </pdfaSchema:property>
                  </rdf:li>
                  <!-- Resume Schema Extension -->
                  <rdf:li rdf:parseType="Resource">
                    <pdfaSchema:schema>Resume Schema</pdfaSchema:schema>
                    <pdfaSchema:namespaceURI>https://tradik.github.io/schema-resume/</pdfaSchema:namespaceURI>
                    <pdfaSchema:prefix>resume</pdfaSchema:prefix>
                    <pdfaSchema:property>
                      <rdf:Seq>
                        <rdf:li rdf:parseType="Resource">
                          <pdfaProperty:name>schemaRef</pdfaProperty:name>
                          <pdfaProperty:valueType>URI</pdfaProperty:valueType>
                          <pdfaProperty:category>external</pdfaProperty:category>
                          <pdfaProperty:description>Reference to the resume schema definition</pdfaProperty:description>
                        </rdf:li>
                        <rdf:li rdf:parseType="Resource">
                          <pdfaProperty:name>schemaVersion</pdfaProperty:name>
                          <pdfaProperty:valueType>Text</pdfaProperty:valueType>
                          <pdfaProperty:category>external</pdfaProperty:category>
                          <pdfaProperty:description>Version of the resume schema</pdfaProperty:description>
                        </rdf:li>
                        <rdf:li rdf:parseType="Resource">
                          <pdfaProperty:name>lastModified</pdfaProperty:name>
                          <pdfaProperty:valueType>Date</pdfaProperty:valueType>
                          <pdfaProperty:category>external</pdfaProperty:category>
                          <pdfaProperty:description>Last modification date of the resume</pdfaProperty:description>
                        </rdf:li>
                        <rdf:li rdf:parseType="Resource">
                          <pdfaProperty:name>linkedinProfile</pdfaProperty:name>
                          <pdfaProperty:valueType>URI</pdfaProperty:valueType>
                          <pdfaProperty:category>external</pdfaProperty:category>
                          <pdfaProperty:description>LinkedIn profile URL</pdfaProperty:description>
                        </rdf:li>
                        <rdf:li rdf:parseType="Resource">
                          <pdfaProperty:name>githubProfile</pdfaProperty:name>
                          <pdfaProperty:valueType>URI</pdfaProperty:valueType>
                          <pdfaProperty:category>external</pdfaProperty:category>
                          <pdfaProperty:description>GitHub profile URL</pdfaProperty:description>
                        </rdf:li>
                        <rdf:li rdf:parseType="Resource">
                          <pdfaProperty:name>stackexchangeProfile</pdfaProperty:name>
                          <pdfaProperty:valueType>URI</pdfaProperty:valueType>
                          <pdfaProperty:category>external</pdfaProperty:category>
                          <pdfaProperty:description>StackExchange profile URL</pdfaProperty:description>
                        </rdf:li>
                      </rdf:Seq>
                    </pdfaSchema:property>
                  </rdf:li>
                </rdf:Bag>
              </pdfaExtension:schemas>
            </rdf:Description>
            
            <!-- Schema.org Person Metadata -->
            <rdf:Description rdf:about="" xmlns:schema="http://schema.org/">
              <schema:email><xsl:value-of select="Schema_Resume_v1.1.0/basics/email"/></schema:email>
              <schema:telephone><xsl:value-of select="Schema_Resume_v1.1.0/basics/phone"/></schema:telephone>
              <schema:url><xsl:value-of select="Schema_Resume_v1.1.0/basics/url"/></schema:url>
              <schema:jobTitle><xsl:value-of select="Schema_Resume_v1.1.0/basics/label"/></schema:jobTitle>
              <xsl:if test="Schema_Resume_v1.1.0/basics/location">
                <schema:address><xsl:value-of select="concat(Schema_Resume_v1.1.0/basics/location/region, ', ', Schema_Resume_v1.1.0/basics/location/countryCode)"/></schema:address>
              </xsl:if>
            </rdf:Description>
            
            <!-- Resume-specific Metadata -->
            <rdf:Description rdf:about="" xmlns:resume="https://tradik.github.io/schema-resume/">
              <resume:schemaVersion><xsl:value-of select="Schema_Resume_v1.1.0/meta/version"/></resume:schemaVersion>
              <resume:lastModified><xsl:value-of select="Schema_Resume_v1.1.0/meta/lastModified"/></resume:lastModified>
              <xsl:for-each select="Schema_Resume_v1.1.0/basics/profiles/item">
                <xsl:element name="resume:{translate(network, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz')}Profile">
                  <xsl:value-of select="url"/>
                </xsl:element>
              </xsl:for-each>
            </rdf:Description>
          </rdf:RDF>
        </x:xmpmeta>
      </fo:declarations>
      
      <!-- Page Content -->
      <fo:page-sequence master-reference="A4" font-family="DejaVu Sans, sans-serif">
      
        <!-- Main Content -->
        <fo:flow flow-name="xsl-region-body">
          
          <!-- Header Section -->
          <fo:block font-family="DejaVu Sans, sans-serif" margin-bottom="10mm">
            <!-- Name - ATS optimized: bold, prominent -->
            <fo:block font-size="24pt" font-weight="bold" color="#2c3e50" margin-bottom="2mm">
              <xsl:value-of select="Schema_Resume_v1.1.0/basics/title"/> <xsl:value-of select="Schema_Resume_v1.1.0/basics/name"/>
            </fo:block>
            
            <!-- Contact Info - ATS optimized: Email | Phone | Location | Link on same line -->
            <fo:block font-size="9pt" color="#555555" space-after="2mm">
              <xsl:if test="Schema_Resume_v1.1.0/basics/email">
                <fo:inline>
                  <fo:basic-link external-destination="url('mailto:{Schema_Resume_v1.1.0/basics/email}')">
                    <xsl:value-of select="Schema_Resume_v1.1.0/basics/email"/>
                  </fo:basic-link>
                </fo:inline>
              </xsl:if>
              
              <xsl:if test="Schema_Resume_v1.1.0/basics/phone">
                <xsl:if test="Schema_Resume_v1.1.0/basics/email"> | </xsl:if>
                <fo:inline>
                  <fo:basic-link external-destination="url({concat('tel:',replace(Schema_Resume_v1.1.0/basics/phone,' ',''))})">
                    <xsl:value-of select="Schema_Resume_v1.1.0/basics/phone"/>
                  </fo:basic-link>
                </fo:inline>
              </xsl:if>
              
              <!-- Location - ATS optimized format: City, ST -->
              <xsl:if test="Schema_Resume_v1.1.0/basics/location">
                <xsl:if test="Schema_Resume_v1.1.0/basics/email or Schema_Resume_v1.1.0/basics/phone"> | </xsl:if>
                <fo:inline>
                  <fo:basic-link external-destination="url({concat('https://www.google.com/maps/search/?api=1&amp;query=',
                    encode-for-uri(Schema_Resume_v1.1.0/basics/location/city), ',', encode-for-uri(Schema_Resume_v1.1.0/basics/location/region))})">
                    <xsl:if test="Schema_Resume_v1.1.0/basics/location/city">
                      <xsl:value-of select="Schema_Resume_v1.1.0/basics/location/city"/>
                      <xsl:text>, </xsl:text>
                    </xsl:if>
                    <xsl:if test="Schema_Resume_v1.1.0/basics/location/region">
                      <xsl:value-of select="Schema_Resume_v1.1.0/basics/location/region"/>
                    </xsl:if>
                    <xsl:if test="Schema_Resume_v1.1.0/basics/location/countryCode">
                      <xsl:text>, </xsl:text>
                      <xsl:value-of select="Schema_Resume_v1.1.0/basics/location/countryCode"/>
                    </xsl:if>
                  </fo:basic-link>
                </fo:inline>
              </xsl:if>
              
              <xsl:if test="Schema_Resume_v1.1.0/basics/url">
                <xsl:if test="Schema_Resume_v1.1.0/basics/email or Schema_Resume_v1.1.0/basics/phone or Schema_Resume_v1.1.0/basics/location"> | </xsl:if>
                <fo:inline>
                  <fo:basic-link external-destination="url({Schema_Resume_v1.1.0/basics/url})">
                    <xsl:value-of select="Schema_Resume_v1.1.0/basics/url"/>
                  </fo:basic-link>
                </fo:inline>
              </xsl:if>
            </fo:block>
            
            <!-- Profiles -->
            <xsl:if test="Schema_Resume_v1.1.0/basics/profiles/item">
              <fo:block font-size="9pt" color="#555555" space-after="3mm">
                <xsl:for-each select="Schema_Resume_v1.1.0/basics/profiles/item">
                  <fo:inline>
                    <fo:basic-link external-destination="url({url})">
                      <xsl:value-of select="url"/>
                    </fo:basic-link>
                  </fo:inline>
                  <xsl:if test="position() != last()"> | </xsl:if>
                </xsl:for-each>
              </fo:block>
            </xsl:if>
            
            <!-- Label/Title -->
            <xsl:if test="Schema_Resume_v1.1.0/basics/label">
              <fo:block font-size="12pt" font-weight="600" color="#34495e" margin-bottom="5mm">
                <xsl:value-of select="Schema_Resume_v1.1.0/basics/label"/>
              </fo:block>
            </xsl:if>
          </fo:block>
          
          <!-- Summary - ATS optimized section -->
          <xsl:if test="Schema_Resume_v1.1.0/basics/summary">
            <fo:block margin-bottom="8mm">
              <!-- Section title: UPPERCASE and bold for ATS parsing -->
              <fo:block font-size="14pt" font-weight="bold" color="#2c3e50" 
                        text-transform="uppercase" margin-bottom="4mm">
                SUMMARY
              </fo:block>
              <fo:block font-size="10pt" line-height="1.5" margin-bottom="4mm">
                <xsl:value-of select="Schema_Resume_v1.1.0/basics/summary"/>
              </fo:block>
            </fo:block>
          </xsl:if>
          
          <!-- Work Experience - ATS optimized section -->
          <xsl:if test="Schema_Resume_v1.1.0/work/item">
            <fo:block margin-bottom="8mm">
              <!-- Section title: UPPERCASE and bold for ATS parsing -->
              <fo:block font-size="14pt" font-weight="bold" color="#2c3e50" 
                        text-transform="uppercase" margin-bottom="5mm">
                WORK EXPERIENCE
              </fo:block>
              
              <xsl:for-each select="Schema_Resume_v1.1.0/work/item">
                <!-- Subsection spacing: 1.4x typical line gap for ATS detection -->
                <fo:block margin-bottom="7mm" space-before="3mm" keep-together.within-page="auto">
                  <!-- Company - Bold for ATS subsection detection -->
                  <fo:block font-size="11pt" font-weight="bold" color="#2c3e50" margin-bottom="1mm">
                    <fo:basic-link external-destination="url({website})">
                      <xsl:value-of select="name"/>
                    </fo:basic-link>
                    <xsl:if test="industry">
                      <fo:inline font-weight="600">
                        <xsl:text> - </xsl:text>
                        <xsl:value-of select="industry"/>
                      </fo:inline>
                    </xsl:if>
                  </fo:block>
                  
                  <!-- Job Title -->
                  <fo:block font-size="10pt" color="#555555" margin-bottom="1mm">
                    <fo:inline font-weight="600">
                      <xsl:value-of select="position"/>
                    </fo:inline>
                  </fo:block>
                  
                  <!-- Dates -->
                  <xsl:if test="startDate">
                    <fo:block font-size="9pt" color="#666666" margin-bottom="2mm">
                      <xsl:value-of select="startDate"/>
                      <xsl:variable name="endLabel" select="if (endDate) then endDate else 'Present'"/>
                      <xsl:text> - </xsl:text>
                      <xsl:value-of select="$endLabel"/>
                    </fo:block>
                  </xsl:if>
                  
                  <!-- Summary -->
                  <xsl:if test="summary">
                    <fo:block font-size="9.5pt" margin-bottom="2mm" font-style="italic">
                      <xsl:value-of select="summary"/>
                    </fo:block>
                  </xsl:if>
                  
                  <!-- Highlights -->
                  <xsl:if test="highlights/item">
                    <fo:list-block provisional-distance-between-starts="5mm" 
                                   provisional-label-separation="2mm" 
                                   font-size="9pt" line-height="1.4">
                      <xsl:for-each select="highlights/item">
                        <fo:list-item margin-bottom="1mm">
                          <fo:list-item-label end-indent="label-end()">
                            <fo:block font-family="DejaVu Sans, sans-serif"></fo:block>
                          </fo:list-item-label>
                          <fo:list-item-body start-indent="body-start()">
                            <fo:block>
                              <xsl:value-of select="."/>
                            </fo:block>
                          </fo:list-item-body>
                        </fo:list-item>
                      </xsl:for-each>
                    </fo:list-block>
                  </xsl:if>
                </fo:block>
              </xsl:for-each>
            </fo:block>
          </xsl:if>
          
          <!-- Education - ATS optimized section -->
          <xsl:if test="Schema_Resume_v1.1.0/education/item">
            <fo:block margin-bottom="8mm">
              <!-- Section title: UPPERCASE and bold for ATS parsing -->
              <fo:block font-size="14pt" font-weight="bold" color="#2c3e50" 
                        text-transform="uppercase" margin-bottom="5mm">
                EDUCATION
              </fo:block>
              
              <xsl:for-each select="Schema_Resume_v1.1.0/education/item">
                <!-- Subsection spacing: 1.4x typical line gap for ATS detection -->
                <fo:block margin-bottom="7mm" space-before="3mm" keep-together.within-page="auto">
                  <!-- School - Bold for ATS subsection detection -->
                  <fo:block font-size="11pt" font-weight="bold" color="#2c3e50" margin-bottom="1mm">
                    <xsl:value-of select="institution"/>
                  </fo:block>

                  <!-- Date - ATS optimized format -->
                  <fo:block font-size="9pt" color="#666666">
                    <xsl:if test="startDate">
                      <xsl:call-template name="format-date">
                        <xsl:with-param name="date" select="startDate"/>
                      </xsl:call-template>
                      <xsl:text> - </xsl:text>
                    </xsl:if>
                    <xsl:choose>
                      <xsl:when test="endDate">
                        <xsl:call-template name="format-date">
                          <xsl:with-param name="date" select="endDate"/>
                        </xsl:call-template>
                      </xsl:when>
                      <xsl:otherwise>Present</xsl:otherwise>
                    </xsl:choose>
                  </fo:block>


                  <!-- Degree -->
                  <fo:block font-size="10pt" color="#555555" margin-bottom="1mm">
                    <xsl:variable name="degreeValue" select="studyType | degree"/>
                    <xsl:variable name="areaValue" select="area | fieldOfStudy"/>
                    
                    <xsl:if test="$degreeValue">
                      <xsl:value-of select="$degreeValue"/>
                      <xsl:if test="$areaValue">
                        <xsl:text> in </xsl:text>
                      </xsl:if>
                    </xsl:if>
                    <xsl:value-of select="$areaValue"/>
                  </fo:block>
                  
                </fo:block>
              </xsl:for-each>
            </fo:block>
          </xsl:if>
          
          <!-- Skills - ATS optimized section -->
          <xsl:if test="Schema_Resume_v1.1.0/skills/item">
            <fo:block margin-bottom="8mm">
              <!-- Section title: UPPERCASE and bold for ATS parsing -->
              <fo:block font-size="14pt" font-weight="bold" color="#2c3e50" 
                        text-transform="uppercase" margin-bottom="5mm">
                SKILLS
              </fo:block>
              
              <xsl:for-each select="Schema_Resume_v1.1.0/skills/item">
                <fo:block margin-bottom="3pt">
                  <fo:inline  font-size="9pt" font-weight="bold" color="#2c3e50">
                    <xsl:value-of select="name"/>: 
                  </fo:inline>
                  <fo:inline font-size="9pt">
                    <xsl:for-each select="keywords/item">
                      <xsl:value-of select="."/>
                      <xsl:if test="position() != last()">, </xsl:if>
                    </xsl:for-each>
                  </fo:inline>
                </fo:block>
              </xsl:for-each>
            </fo:block>
          </xsl:if>
          
          <!-- Tools - ATS optimized section, grouped by category -->
          <xsl:if test="Schema_Resume_v1.1.0/tools/item">
            <fo:block margin-bottom="8mm">
              <!-- Section title: UPPERCASE and bold for ATS parsing -->
              <fo:block font-size="14pt" font-weight="bold" color="#2c3e50" 
                        text-transform="uppercase" margin-bottom="5mm">
                TOOLS &amp; TECHNOLOGIES
              </fo:block>
              
              <!-- Group tools by category using Muenchian method -->
              <xsl:for-each select="Schema_Resume_v1.1.0/tools/item[not(category=preceding-sibling::item/category)]">
                <xsl:variable name="current-category" select="category"/>
                <fo:block margin-bottom="3pt">
                  <fo:inline font-size="9pt" font-weight="bold" color="#2c3e50">
                    <xsl:value-of select="$current-category"/>: 
                  </fo:inline>
                  <fo:inline font-size="9pt">
                    <xsl:for-each select="../item[category=$current-category]">
                      <xsl:value-of select="name"/>
                      <xsl:if test="yearsOfExperience"> (<xsl:value-of select="yearsOfExperience"/>y)</xsl:if>
                      <xsl:if test="position() != last()">, </xsl:if>
                    </xsl:for-each>
                  </fo:inline>
                </fo:block>
              </xsl:for-each>
            </fo:block>
          </xsl:if>
          
          <!-- Languages - ATS optimized section -->
          <xsl:if test="Schema_Resume_v1.1.0/languages/item">
            <fo:block margin-bottom="8mm">
              <!-- Section title: UPPERCASE and bold for ATS parsing -->
              <fo:block font-size="14pt" font-weight="bold" color="#2c3e50" 
                        text-transform="uppercase" margin-bottom="5mm">
                LANGUAGES
              </fo:block>
              
              <fo:block font-size="10pt">
                <xsl:for-each select="Schema_Resume_v1.1.0/languages/item">
                  <fo:inline>
                    <fo:inline font-weight="bold"><xsl:value-of select="language"/></fo:inline>
                    <xsl:if test="fluency"> (<xsl:value-of select="fluency"/>)</xsl:if>
                  </fo:inline>
                  <xsl:if test="position() != last()"> | </xsl:if>
                </xsl:for-each>
              </fo:block>
            </fo:block>
          </xsl:if>
          
          <!-- Projects - ATS optimized section -->
          <xsl:if test="Schema_Resume_v1.1.0/projects/item">
            <fo:block margin-bottom="8mm">
              <!-- Section title: UPPERCASE and bold for ATS parsing -->
              <fo:block font-size="14pt" font-weight="bold" color="#2c3e50" 
                        text-transform="uppercase" margin-bottom="5mm">
                PROJECTS
              </fo:block>
              
              <xsl:for-each select="Schema_Resume_v1.1.0/projects/item">
                <!-- Subsection spacing: 1.4x typical line gap for ATS detection -->
                <fo:block margin-bottom="7mm" space-before="3mm" keep-together.within-page="auto">
                  <!-- Project Name - Bold for ATS subsection detection -->
                  <fo:block font-size="11pt" font-weight="bold" color="#2c3e50" margin-bottom="1mm">
                    <xsl:choose>
                      <xsl:when test="url">
                        <fo:basic-link external-destination="url({url})">
                          <xsl:value-of select="name"/>
                        </fo:basic-link>
                      </xsl:when>
                      <xsl:otherwise>
                        <xsl:value-of select="name"/>
                      </xsl:otherwise>
                    </xsl:choose>
                  </fo:block>
                  
                  <!-- Dates -->
                  <xsl:if test="startDate">
                    <fo:block font-size="9pt" color="#666666" margin-bottom="2mm">
                      <xsl:value-of select="startDate"/>
                      <xsl:if test="endDate">
                        <xsl:text> - </xsl:text>
                        <xsl:value-of select="endDate"/>
                      </xsl:if>
                    </fo:block>
                  </xsl:if>
                  
                  <!-- Description -->
                  <xsl:if test="description">
                    <fo:block font-size="9.5pt" margin-bottom="2mm" font-style="italic">
                      <xsl:value-of select="description"/>
                    </fo:block>
                  </xsl:if>
                  
                  <!-- Highlights -->
                  <xsl:if test="highlights/item">
                    <fo:list-block provisional-distance-between-starts="5mm" 
                                   provisional-label-separation="2mm" 
                                   font-size="9pt" line-height="1.4">
                      <xsl:for-each select="highlights/item">
                        <fo:list-item margin-bottom="1mm">
                          <fo:list-item-label end-indent="label-end()">
                            <fo:block font-family="DejaVu Sans, sans-serif">•</fo:block>
                          </fo:list-item-label>
                          <fo:list-item-body start-indent="body-start()">
                            <fo:block>
                              <xsl:value-of select="."/>
                            </fo:block>
                          </fo:list-item-body>
                        </fo:list-item>
                      </xsl:for-each>
                    </fo:list-block>
                  </xsl:if>
                  
                  <!-- Keywords -->
                  <xsl:if test="keywords/item">
                    <fo:block font-size="9pt" color="#555555" margin-bottom="2mm">
                      <fo:inline font-weight="bold">Technologies: </fo:inline>
                      <xsl:for-each select="keywords/item">
                        <xsl:value-of select="."/>
                        <xsl:if test="position() != last()">, </xsl:if>
                      </xsl:for-each>
                    </fo:block>
                  </xsl:if>
                </fo:block>
              </xsl:for-each>
            </fo:block>
          </xsl:if>
          
          <!-- Publications - ATS optimized section -->
          <xsl:if test="Schema_Resume_v1.1.0/publications/item">
            <fo:block margin-bottom="8mm">
              <!-- Section title: UPPERCASE and bold for ATS parsing -->
              <fo:block font-size="14pt" font-weight="bold" color="#2c3e50" 
                        text-transform="uppercase" margin-bottom="5mm">
                PUBLICATIONS
              </fo:block>
              
              <xsl:for-each select="Schema_Resume_v1.1.0/publications/item">
                <!-- Subsection spacing -->
                <fo:block margin-bottom="5mm" space-before="2mm" keep-together.within-page="auto">
                  <!-- Publication Name - Bold for ATS subsection detection -->
                  <fo:block font-size="10pt" font-weight="bold" color="#2c3e50" margin-bottom="1mm">
                    <xsl:choose>
                      <xsl:when test="url">
                        <fo:basic-link external-destination="url({url})">
                          <xsl:value-of select="name"/>
                        </fo:basic-link>
                      </xsl:when>
                      <xsl:otherwise>
                        <xsl:value-of select="name"/>
                      </xsl:otherwise>
                    </xsl:choose>
                  </fo:block>
                  
                  <!-- Publisher and Date -->
                  <fo:block font-size="9pt" color="#555555" margin-bottom="1mm">
                    <xsl:if test="publisher">
                      <xsl:value-of select="publisher"/>
                    </xsl:if>
                    <xsl:if test="releaseDate">
                      <xsl:if test="publisher"> – </xsl:if>
                      <xsl:value-of select="releaseDate"/>
                    </xsl:if>
                  </fo:block>
                  
                  <!-- Summary -->
                  <xsl:if test="summary">
                    <fo:block font-size="9pt" color="#666666">
                      <xsl:value-of select="summary"/>
                    </fo:block>
                  </xsl:if>
                </fo:block>
              </xsl:for-each>
            </fo:block>
          </xsl:if>
          
          <!-- Awards - ATS optimized section -->
          <xsl:if test="Schema_Resume_v1.1.0/awards/item">
            <fo:block margin-bottom="8mm">
              <!-- Section title: UPPERCASE and bold for ATS parsing -->
              <fo:block font-size="14pt" font-weight="bold" color="#2c3e50" 
                        text-transform="uppercase" margin-bottom="5mm">
                AWARDS
              </fo:block>
              
              <xsl:for-each select="Schema_Resume_v1.1.0/awards/item">
                <!-- Subsection spacing -->
                <fo:block margin-bottom="5mm" space-before="2mm" keep-together.within-page="auto">
                  <!-- Award Title - Bold for ATS subsection detection -->
                  <fo:block font-size="10pt" font-weight="bold" color="#2c3e50" margin-bottom="1mm">
                    <xsl:value-of select="title"/>
                  </fo:block>
                  
                  <!-- Awarder and Date -->
                  <fo:block font-size="9pt" color="#555555" margin-bottom="1mm">
                    <xsl:if test="awarder">
                      <xsl:value-of select="awarder"/>
                    </xsl:if>
                    <xsl:if test="date">
                      <xsl:if test="awarder"> – </xsl:if>
                      <xsl:value-of select="date"/>
                    </xsl:if>
                  </fo:block>
                  
                  <!-- Summary -->
                  <xsl:if test="summary">
                    <fo:block font-size="9pt" color="#666666">
                      <xsl:value-of select="summary"/>
                    </fo:block>
                  </xsl:if>
                </fo:block>
              </xsl:for-each>
            </fo:block>
          </xsl:if>
          
          <!-- Certifications - ATS optimized section -->
          <xsl:if test="Schema_Resume_v1.1.0/certificates/item">
            <fo:block margin-bottom="8mm">
              <!-- Section title: UPPERCASE and bold for ATS parsing -->
              <fo:block font-size="14pt" font-weight="bold" color="#2c3e50" 
                        text-transform="uppercase" margin-bottom="5mm">
                CERTIFICATIONS
              </fo:block>
              
              <xsl:for-each select="Schema_Resume_v1.1.0/certificates/item">
                <fo:block margin-bottom="2mm" font-size="10pt">
                  <fo:inline font-weight="bold"><xsl:value-of select="name"/></fo:inline>
                  <xsl:if test="issuer"> - <xsl:value-of select="issuer"/></xsl:if>
                  <xsl:if test="date"> (<xsl:value-of select="date"/>)</xsl:if>
                </fo:block>
              </xsl:for-each>
            </fo:block>
          </xsl:if>
          
        </fo:flow>
      </fo:page-sequence>
    </fo:root>
  </xsl:template>
  
  <!-- Date Formatting Template -->
  <xsl:template name="format-date">
    <xsl:param name="date"/>
    <xsl:choose>
      <!-- Format: YYYY-MM -->
      <xsl:when test="string-length($date) = 7">
        <xsl:variable name="year" select="substring($date, 1, 4)"/>
        <xsl:variable name="month" select="substring($date, 6, 2)"/>
        <xsl:call-template name="month-name">
          <xsl:with-param name="month" select="$month"/>
        </xsl:call-template>
        <xsl:text> </xsl:text>
        <xsl:value-of select="$year"/>
      </xsl:when>
      <!-- Format: YYYY -->
      <xsl:when test="string-length($date) = 4">
        <xsl:value-of select="$date"/>
      </xsl:when>
      <xsl:otherwise>
        <xsl:value-of select="$date"/>
      </xsl:otherwise>
    </xsl:choose>
  </xsl:template>
  
  <!-- Month Name Template -->
  <xsl:template name="month-name">
    <xsl:param name="month"/>
    <xsl:choose>
      <xsl:when test="$month = '01'">January</xsl:when>
      <xsl:when test="$month = '02'">February</xsl:when>
      <xsl:when test="$month = '03'">March</xsl:when>
      <xsl:when test="$month = '04'">April</xsl:when>
      <xsl:when test="$month = '05'">May</xsl:when>
      <xsl:when test="$month = '06'">June</xsl:when>
      <xsl:when test="$month = '07'">July</xsl:when>
      <xsl:when test="$month = '08'">August</xsl:when>
      <xsl:when test="$month = '09'">September</xsl:when>
      <xsl:when test="$month = '10'">October</xsl:when>
      <xsl:when test="$month = '11'">November</xsl:when>
      <xsl:when test="$month = '12'">December</xsl:when>
      <xsl:otherwise><xsl:value-of select="$month"/></xsl:otherwise>
    </xsl:choose>
  </xsl:template>
  
</xsl:stylesheet>
