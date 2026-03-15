<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" encoding="UTF-8" indent="yes"/>
  
  <xsl:template match="/">
    <html>
      <head>
        <style>
          /* Professional ATS-Optimized Resume Template */
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: 'DejaVu Sans', 'Segoe UI', Arial, sans-serif;
            font-size: 10pt;
            line-height: 1.5;
            color: #333;
          }
          
          .resume-container {
            max-width: 100%;
            padding: 0;
          }
          
          /* Header Section - ATS Optimized */
          .header {
            margin-bottom: 10mm;
          }
          
          .name {
            font-size: 24pt;
            font-weight: bold;
            color: #2c3e50;
            margin-bottom: 2mm;
          }
          
          .contact-info {
            font-size: 9pt;
            color: #555555;
            margin-bottom: 2mm;
          }
          
          .contact-info a {
            color: #555555;
            text-decoration: none;
          }
          
          .contact-info a:hover {
            color: #3498db;
            text-decoration: underline;
          }
          
          .profiles {
            font-size: 9pt;
            color: #555555;
            margin-bottom: 3mm;
          }
          
          .profiles a {
            color: #555555;
            text-decoration: none;
          }
          
          .profiles a:hover {
            color: #3498db;
            text-decoration: underline;
          }
          
          .job-title {
            font-size: 12pt;
            font-weight: 600;
            color: #34495e;
            margin-bottom: 5mm;
          }
          
          /* Section Headers - ATS Optimized: UPPERCASE */
          .section {
            margin-bottom: 8mm;
          }
          
          .section-title {
            font-size: 14pt;
            font-weight: bold;
            color: #2c3e50;
            text-transform: uppercase;
            margin-bottom: 5mm;
          }
          
          /* Summary Section */
          .summary-text {
            font-size: 10pt;
            line-height: 1.5;
            margin-bottom: 4mm;
          }
          
          /* Work Experience - ATS Optimized */
          .work-item {
            margin-bottom: 7mm;
            margin-top: 3mm;
            page-break-inside: avoid;
          }
          
          .company-name {
            font-size: 11pt;
            font-weight: bold;
            color: #2c3e50;
            margin-bottom: 1mm;
          }
          
          .company-name a {
            color: #2c3e50;
            text-decoration: none;
          }
          
          .company-name a:hover {
            color: #3498db;
            text-decoration: underline;
          }
          
          .position {
            font-size: 10pt;
            color: #555555;
            font-weight: 600;
            margin-bottom: 1mm;
          }
          
          .work-dates {
            font-size: 9pt;
            color: #666666;
            margin-bottom: 2mm;
          }
          
          .work-summary {
            font-size: 9.5pt;
            margin-bottom: 2mm;
            font-style: italic;
          }
          
          .highlights {
            list-style: none;
            padding-left: 5mm;
            font-size: 9pt;
            line-height: 1.4;
          }
          
          .highlights li {
            margin-bottom: 1mm;
            position: relative;
          }
          
          .highlights li:before {
            content: "•";
            position: absolute;
            left: -5mm;
          }
          
          /* Education - ATS Optimized */
          .education-item {
            margin-bottom: 7mm;
            margin-top: 3mm;
            page-break-inside: avoid;
          }
          
          .institution {
            font-size: 11pt;
            font-weight: bold;
            color: #2c3e50;
            margin-bottom: 1mm;
          }
          
          .education-dates {
            font-size: 9pt;
            color: #666666;
          }
          
          .degree {
            font-size: 10pt;
            color: #555555;
            margin-bottom: 1mm;
          }
          
          /* Skills - ATS Optimized */
          .skill-item {
            margin-bottom: 3pt;
          }
          
          .skill-name {
            font-size: 9pt;
            font-weight: bold;
            color: #2c3e50;
          }
          
          .skill-keywords {
            font-size: 9pt;
          }
          
          /* Languages */
          .languages-list {
            font-size: 10pt;
          }
          
          .language-item {
            display: inline;
          }
          
          .language-name {
            font-weight: bold;
          }
          
          /* Certifications */
          .cert-item {
            margin-bottom: 2mm;
            font-size: 10pt;
          }
          
          .cert-name {
            font-weight: bold;
          }
          
          /* Projects */
          .project-item {
            margin-bottom: 7mm;
            margin-top: 3mm;
            page-break-inside: avoid;
          }
          
          .project-name {
            font-size: 11pt;
            font-weight: bold;
            color: #2c3e50;
            margin-bottom: 1mm;
          }
          
          .project-name a {
            color: #2c3e50;
            text-decoration: none;
          }
          
          .project-name a:hover {
            color: #3498db;
            text-decoration: underline;
          }
          
          .project-dates {
            font-size: 9pt;
            color: #666666;
            margin-bottom: 2mm;
          }
          
          .project-description {
            font-size: 9.5pt;
            margin-bottom: 2mm;
            font-style: italic;
          }
          
          .project-keywords {
            font-size: 9pt;
            color: #555555;
            margin-bottom: 2mm;
          }
          
          /* Publications */
          .publication-item {
            margin-bottom: 5mm;
            margin-top: 2mm;
            page-break-inside: avoid;
          }
          
          .publication-name {
            font-size: 10pt;
            font-weight: bold;
            color: #2c3e50;
            margin-bottom: 1mm;
          }
          
          .publication-name a {
            color: #2c3e50;
            text-decoration: none;
          }
          
          .publication-name a:hover {
            color: #3498db;
            text-decoration: underline;
          }
          
          .publication-publisher {
            font-size: 9pt;
            color: #555555;
            margin-bottom: 1mm;
          }
          
          .publication-summary {
            font-size: 9pt;
            color: #666666;
          }
          
          /* Awards */
          .award-item {
            margin-bottom: 5mm;
            margin-top: 2mm;
            page-break-inside: avoid;
          }
          
          .award-title {
            font-size: 10pt;
            font-weight: bold;
            color: #2c3e50;
            margin-bottom: 1mm;
          }
          
          .award-awarder {
            font-size: 9pt;
            color: #555555;
            margin-bottom: 1mm;
          }
          
          .award-summary {
            font-size: 9pt;
            color: #666666;
          }
        </style>
      </head>
      <body>
        <div class="resume-container">
          <!-- Header Section - ATS Optimized -->
          <div class="header">
            <!-- Name - ATS optimized: bold, prominent -->
            <div class="name">
              <xsl:if test="Schema_Resume_v1.1.0/basics/title">
                <span data-field="basics.title"><xsl:value-of select="Schema_Resume_v1.1.0/basics/title"/></span>
                <xsl:text> </xsl:text>
              </xsl:if>
              <span data-field="basics.name"><xsl:value-of select="Schema_Resume_v1.1.0/basics/name"/></span>
            </div>
            
            <!-- Contact Info - ATS optimized: Email | Phone | Location | Link on same line -->
            <div class="contact-info">
              <xsl:if test="Schema_Resume_v1.1.0/basics/email">
                <a href="mailto:{Schema_Resume_v1.1.0/basics/email}" data-field="basics.email">
                  <xsl:value-of select="Schema_Resume_v1.1.0/basics/email"/>
                </a>
              </xsl:if>
              
              <xsl:if test="Schema_Resume_v1.1.0/basics/phone">
                <xsl:if test="Schema_Resume_v1.1.0/basics/email"> | </xsl:if>
                <a href="tel:{translate(Schema_Resume_v1.1.0/basics/phone, ' ', '')}" data-field="basics.phone">
                  <xsl:value-of select="Schema_Resume_v1.1.0/basics/phone"/>
                </a>
              </xsl:if>
              
              <!-- Location - ATS optimized format: City, ST -->
              <xsl:if test="Schema_Resume_v1.1.0/basics/location">
                <xsl:if test="Schema_Resume_v1.1.0/basics/email or Schema_Resume_v1.1.0/basics/phone"> | </xsl:if>
                <xsl:if test="Schema_Resume_v1.1.0/basics/location/city">
                  <span data-field="basics.location.city"><xsl:value-of select="Schema_Resume_v1.1.0/basics/location/city"/></span>, 
                </xsl:if>
                <xsl:if test="Schema_Resume_v1.1.0/basics/location/region">
                  <span data-field="basics.location.region"><xsl:value-of select="Schema_Resume_v1.1.0/basics/location/region"/></span>
                </xsl:if>
                <xsl:if test="Schema_Resume_v1.1.0/basics/location/countryCode">
                  , <span data-field="basics.location.countryCode"><xsl:value-of select="Schema_Resume_v1.1.0/basics/location/countryCode"/></span>
                </xsl:if>
              </xsl:if>
              
              <xsl:if test="Schema_Resume_v1.1.0/basics/url">
                <xsl:if test="Schema_Resume_v1.1.0/basics/email or Schema_Resume_v1.1.0/basics/phone or Schema_Resume_v1.1.0/basics/location"> | </xsl:if>
                <a href="{Schema_Resume_v1.1.0/basics/url}" data-field="basics.url">
                  <xsl:value-of select="Schema_Resume_v1.1.0/basics/url"/>
                </a>
              </xsl:if>
            </div>
            
            <!-- Profiles -->
            <xsl:if test="Schema_Resume_v1.1.0/basics/profiles/item">
              <div class="profiles">
                <xsl:for-each select="Schema_Resume_v1.1.0/basics/profiles/item">
                  <xsl:variable name="profileIndex" select="position() - 1"/>
                  <xsl:if test="position() > 1"> | </xsl:if>
                  <a href="{url}" data-field="basics.profiles.{$profileIndex}.url">
                    <span data-field="basics.profiles.{$profileIndex}.network"><xsl:value-of select="network"/></span>
                  </a>
                </xsl:for-each>
              </div>
            </xsl:if>
            
            <!-- Label/Title -->
            <xsl:if test="Schema_Resume_v1.1.0/basics/label">
              <div class="job-title" data-field="basics.label">
                <xsl:value-of select="Schema_Resume_v1.1.0/basics/label"/>
              </div>
            </xsl:if>
          </div>
          
          <!-- Summary - ATS optimized section -->
          <xsl:if test="Schema_Resume_v1.1.0/basics/summary">
            <div class="section">
              <div class="section-title">SUMMARY</div>
              <div class="summary-text" data-field="basics.summary">
                <xsl:value-of select="Schema_Resume_v1.1.0/basics/summary"/>
              </div>
            </div>
          </xsl:if>
          
          <!-- Work Experience - ATS optimized section -->
          <xsl:if test="Schema_Resume_v1.1.0/work/item">
            <div class="section">
              <div class="section-title">WORK EXPERIENCE</div>
              
              <xsl:for-each select="Schema_Resume_v1.1.0/work/item">
                <xsl:variable name="workIndex" select="position() - 1"/>
                <div class="work-item">
                  <!-- Company - Bold for ATS subsection detection -->
                  <div class="company-name">
                    <xsl:choose>
                      <xsl:when test="url">
                        <a href="{url}" data-field="work.{$workIndex}.name"><xsl:value-of select="name"/></a>
                      </xsl:when>
                      <xsl:otherwise>
                        <span data-field="work.{$workIndex}.name"><xsl:value-of select="name"/></span>
                      </xsl:otherwise>
                    </xsl:choose>
                    <xsl:if test="industry">
                      <span style="font-weight: 600;" data-field="work.{$workIndex}.industry">
                        <xsl:text> - </xsl:text>
                        <xsl:value-of select="industry"/>
                      </span>
                    </xsl:if>
                  </div>
                  
                  <!-- Job Title -->
                  <div class="position" data-field="work.{$workIndex}.position">
                    <xsl:value-of select="position"/>
                  </div>
                  
                  <!-- Dates -->
                  <xsl:if test="startDate">
                    <div class="work-dates">
                      <span data-field="work.{$workIndex}.startDate"><xsl:value-of select="startDate"/></span>
                      <xsl:text> - </xsl:text>
                      <xsl:choose>
                        <xsl:when test="endDate">
                          <span data-field="work.{$workIndex}.endDate"><xsl:value-of select="endDate"/></span>
                        </xsl:when>
                        <xsl:otherwise>Present</xsl:otherwise>
                      </xsl:choose>
                    </div>
                  </xsl:if>
                  
                  <!-- Summary -->
                  <xsl:if test="summary">
                    <div class="work-summary" data-field="work.{$workIndex}.summary">
                      <xsl:value-of select="summary"/>
                    </div>
                  </xsl:if>
                  
                  <!-- Highlights -->
                  <xsl:if test="highlights/item">
                    <ul class="highlights">
                      <xsl:for-each select="highlights/item">
                        <xsl:variable name="highlightIndex" select="position() - 1"/>
                        <li data-field="work.{$workIndex}.highlights.{$highlightIndex}"><xsl:value-of select="."/></li>
                      </xsl:for-each>
                    </ul>
                  </xsl:if>
                </div>
              </xsl:for-each>
            </div>
          </xsl:if>
          
          <!-- Education - ATS optimized section -->
          <xsl:if test="Schema_Resume_v1.1.0/education/item">
            <div class="section">
              <div class="section-title">EDUCATION</div>
              
              <xsl:for-each select="Schema_Resume_v1.1.0/education/item">
                <xsl:variable name="eduIndex" select="position() - 1"/>
                <div class="education-item">
                  <!-- School - Bold for ATS subsection detection -->
                  <div class="institution" data-field="education.{$eduIndex}.institution">
                    <xsl:value-of select="institution"/>
                  </div>
                  
                  <!-- Date - ATS optimized format -->
                  <div class="education-dates">
                    <xsl:if test="startDate">
                      <span data-field="education.{$eduIndex}.startDate"><xsl:value-of select="startDate"/></span>
                      <xsl:text> - </xsl:text>
                    </xsl:if>
                    <xsl:choose>
                      <xsl:when test="endDate">
                        <span data-field="education.{$eduIndex}.endDate"><xsl:value-of select="endDate"/></span>
                      </xsl:when>
                      <xsl:otherwise>Present</xsl:otherwise>
                    </xsl:choose>
                  </div>
                  
                  <!-- Degree -->
                  <div class="degree">
                    <xsl:if test="studyType">
                      <span data-field="education.{$eduIndex}.studyType"><xsl:value-of select="studyType"/></span>
                      <xsl:if test="area">
                        <xsl:text> in </xsl:text>
                      </xsl:if>
                    </xsl:if>
                    <span data-field="education.{$eduIndex}.area"><xsl:value-of select="area"/></span>
                  </div>
                </div>
              </xsl:for-each>
            </div>
          </xsl:if>
          
          <!-- Skills - ATS optimized section -->
          <xsl:if test="Schema_Resume_v1.1.0/skills/item">
            <div class="section">
              <div class="section-title">SKILLS</div>
              
              <xsl:for-each select="Schema_Resume_v1.1.0/skills/item">
                <xsl:variable name="skillIndex" select="position() - 1"/>
                <div class="skill-item">
                  <span class="skill-name" data-field="skills.{$skillIndex}.name"><xsl:value-of select="name"/>: </span>
                  <span class="skill-keywords">
                    <xsl:for-each select="keywords/item">
                      <xsl:value-of select="."/>
                      <xsl:if test="position() != last()">, </xsl:if>
                    </xsl:for-each>
                  </span>
                </div>
              </xsl:for-each>
            </div>
          </xsl:if>
          
          <!-- Tools - ATS optimized section, grouped by category -->
          <xsl:if test="Schema_Resume_v1.1.0/tools/item">
            <div class="section">
              <div class="section-title">TOOLS &amp; TECHNOLOGIES</div>
              
              <!-- Group tools by category -->
              <xsl:for-each select="Schema_Resume_v1.1.0/tools/item[not(category=preceding-sibling::item/category)]">
                <xsl:variable name="current-category" select="category"/>
                <div class="skill-item">
                  <span class="skill-name"><xsl:value-of select="$current-category"/>: </span>
                  <span class="skill-keywords">
                    <xsl:for-each select="../item[category=$current-category]">
                      <xsl:variable name="toolIndex">
                        <xsl:number count="item" from="Schema_Resume_v1.1.0/tools"/>
                      </xsl:variable>
                      <span data-field="tools.{$toolIndex - 1}.name"><xsl:value-of select="name"/></span>
                      <xsl:if test="yearsOfExperience"> (<span data-field="tools.{$toolIndex - 1}.yearsOfExperience"><xsl:value-of select="yearsOfExperience"/></span>y)</xsl:if>
                      <xsl:if test="position() != last()">, </xsl:if>
                    </xsl:for-each>
                  </span>
                </div>
              </xsl:for-each>
            </div>
          </xsl:if>
          
          <!-- Languages - ATS optimized section -->
          <xsl:if test="Schema_Resume_v1.1.0/languages/item">
            <div class="section">
              <div class="section-title">LANGUAGES</div>
              
              <div class="languages-list">
                <xsl:for-each select="Schema_Resume_v1.1.0/languages/item">
                  <xsl:variable name="langIndex" select="position() - 1"/>
                  <span class="language-item">
                    <span class="language-name" data-field="languages.{$langIndex}.language"><xsl:value-of select="language"/></span>
                    <xsl:if test="fluency"> (<span data-field="languages.{$langIndex}.fluency"><xsl:value-of select="fluency"/></span>)</xsl:if>
                  </span>
                  <xsl:if test="position() != last()"> | </xsl:if>
                </xsl:for-each>
              </div>
            </div>
          </xsl:if>
          
          <!-- Projects - ATS optimized section -->
          <xsl:if test="Schema_Resume_v1.1.0/projects/item">
            <div class="section">
              <div class="section-title">PROJECTS</div>
              
              <xsl:for-each select="Schema_Resume_v1.1.0/projects/item">
                <xsl:variable name="projectIndex" select="position() - 1"/>
                <div class="project-item">
                  <!-- Project Name -->
                  <div class="project-name">
                    <xsl:choose>
                      <xsl:when test="url">
                        <a href="{url}" data-field="projects.{$projectIndex}.name"><xsl:value-of select="name"/></a>
                      </xsl:when>
                      <xsl:otherwise>
                        <span data-field="projects.{$projectIndex}.name"><xsl:value-of select="name"/></span>
                      </xsl:otherwise>
                    </xsl:choose>
                  </div>
                  
                  <!-- Dates -->
                  <xsl:if test="startDate">
                    <div class="project-dates">
                      <span data-field="projects.{$projectIndex}.startDate"><xsl:value-of select="startDate"/></span>
                      <xsl:if test="endDate">
                        <xsl:text> - </xsl:text>
                        <span data-field="projects.{$projectIndex}.endDate"><xsl:value-of select="endDate"/></span>
                      </xsl:if>
                    </div>
                  </xsl:if>
                  
                  <!-- Description -->
                  <xsl:if test="description">
                    <div class="project-description" data-field="projects.{$projectIndex}.description">
                      <xsl:value-of select="description"/>
                    </div>
                  </xsl:if>
                  
                  <!-- Highlights -->
                  <xsl:if test="highlights/item">
                    <ul class="highlights">
                      <xsl:for-each select="highlights/item">
                        <xsl:variable name="highlightIndex" select="position() - 1"/>
                        <li data-field="projects.{$projectIndex}.highlights.{$highlightIndex}"><xsl:value-of select="."/></li>
                      </xsl:for-each>
                    </ul>
                  </xsl:if>
                  
                  <!-- Keywords -->
                  <xsl:if test="keywords/item">
                    <div class="project-keywords">
                      <strong>Technologies: </strong>
                      <xsl:for-each select="keywords/item">
                        <xsl:value-of select="."/>
                        <xsl:if test="position() != last()">, </xsl:if>
                      </xsl:for-each>
                    </div>
                  </xsl:if>
                </div>
              </xsl:for-each>
            </div>
          </xsl:if>
          
          <!-- Publications - ATS optimized section -->
          <xsl:if test="Schema_Resume_v1.1.0/publications/item">
            <div class="section">
              <div class="section-title">PUBLICATIONS</div>
              
              <xsl:for-each select="Schema_Resume_v1.1.0/publications/item">
                <xsl:variable name="pubIndex" select="position() - 1"/>
                <div class="publication-item">
                  <!-- Publication Name -->
                  <div class="publication-name">
                    <xsl:choose>
                      <xsl:when test="url">
                        <a href="{url}" data-field="publications.{$pubIndex}.name"><xsl:value-of select="name"/></a>
                      </xsl:when>
                      <xsl:otherwise>
                        <span data-field="publications.{$pubIndex}.name"><xsl:value-of select="name"/></span>
                      </xsl:otherwise>
                    </xsl:choose>
                  </div>
                  
                  <!-- Publisher and Date -->
                  <div class="publication-publisher">
                    <xsl:if test="publisher">
                      <span data-field="publications.{$pubIndex}.publisher"><xsl:value-of select="publisher"/></span>
                    </xsl:if>
                    <xsl:if test="releaseDate">
                      <xsl:if test="publisher"> – </xsl:if>
                      <span data-field="publications.{$pubIndex}.releaseDate"><xsl:value-of select="releaseDate"/></span>
                    </xsl:if>
                  </div>
                  
                  <!-- Summary -->
                  <xsl:if test="summary">
                    <div class="publication-summary" data-field="publications.{$pubIndex}.summary">
                      <xsl:value-of select="summary"/>
                    </div>
                  </xsl:if>
                </div>
              </xsl:for-each>
            </div>
          </xsl:if>
          
          <!-- Awards - ATS optimized section -->
          <xsl:if test="Schema_Resume_v1.1.0/awards/item">
            <div class="section">
              <div class="section-title">AWARDS</div>
              
              <xsl:for-each select="Schema_Resume_v1.1.0/awards/item">
                <xsl:variable name="awardIndex" select="position() - 1"/>
                <div class="award-item">
                  <!-- Award Title -->
                  <div class="award-title" data-field="awards.{$awardIndex}.title">
                    <xsl:value-of select="title"/>
                  </div>
                  
                  <!-- Awarder and Date -->
                  <div class="award-awarder">
                    <xsl:if test="awarder">
                      <span data-field="awards.{$awardIndex}.awarder"><xsl:value-of select="awarder"/></span>
                    </xsl:if>
                    <xsl:if test="date">
                      <xsl:if test="awarder"> – </xsl:if>
                      <span data-field="awards.{$awardIndex}.date"><xsl:value-of select="date"/></span>
                    </xsl:if>
                  </div>
                  
                  <!-- Summary -->
                  <xsl:if test="summary">
                    <div class="award-summary" data-field="awards.{$awardIndex}.summary">
                      <xsl:value-of select="summary"/>
                    </div>
                  </xsl:if>
                </div>
              </xsl:for-each>
            </div>
          </xsl:if>
          
          <!-- Certifications - ATS optimized section -->
          <xsl:if test="Schema_Resume_v1.1.0/certificates/item">
            <div class="section">
              <div class="section-title">CERTIFICATIONS</div>
              
              <xsl:for-each select="Schema_Resume_v1.1.0/certificates/item">
                <xsl:variable name="certIndex" select="position() - 1"/>
                <div class="cert-item">
                  <span class="cert-name" data-field="certificates.{$certIndex}.name"><xsl:value-of select="name"/></span>
                  <xsl:if test="issuer"> – <span data-field="certificates.{$certIndex}.issuer"><xsl:value-of select="issuer"/></span></xsl:if>
                  <xsl:if test="date"> (<span data-field="certificates.{$certIndex}.date"><xsl:value-of select="date"/></span>)</xsl:if>
                </div>
              </xsl:for-each>
            </div>
          </xsl:if>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
