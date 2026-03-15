<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" encoding="UTF-8" indent="yes" doctype-system="about:legacy-compat"/>
  
  <xsl:template match="/">
    <html>
      <head>
        <title><xsl:value-of select="Schema_Resume_v1.1.0/basics/name"/> - Resume</title>
        <meta charset="utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin=""/>
        <link href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,300;0,400;0,600;1,400&amp;display=swap" rel="stylesheet"/>
        <style>
          /* Reset and Base Styles */
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          html {
            font-family: 'Aptos', 'Roboto', sans-serif;
            background: #fff;
            font-size: 11px;
            line-height: 1.5;
          }
          
          body {
            color: #333;
            background: #fff;
          }
          
          /* Typography */
          h1 {
            font-size: 3rem;
            text-align: center;
            margin-top: 20px;
            margin-bottom: 20px;
            font-weight: 400;
            color: #000;
          }
          
          h2 {
            font-size: 1.65rem;
            margin: 0;
            padding: 0;
            margin-bottom: 3px;
            font-weight: 600;
            color: #000;
          }
          
          h3 {
            font-weight: 600;
            font-size: 1.45rem;
            margin-bottom: 3px;
            color: #000;
          }
          
          p {
            padding: 0;
            margin: 0;
            font-size: 1.4rem;
            line-height: 1.5rem;
          }
          
          a {
            text-decoration: none;
            color: inherit;
          }
          
          a:hover {
            color: #000;
          }
          
          ul {
            list-style: none;
            margin: 0;
            padding: 0;
          }
          
          /* Layout */
          .container {
            max-width: 660px;
            margin: 0 auto;
            margin-bottom: 40px;
            padding: 0 20px;
          }
          
          .section {
            max-width: 700px;
            margin: 0 auto 18px;
          }
          
          .section-content {
            margin: 0 8px;
          }
          
          .section hr {
            margin: 0;
            padding: 0;
            margin-top: 7px;
            margin-bottom: 3px;
            border: none;
            border-top: 1px solid #000;
          }
          
          /* Header / Basics */
          .header-info {
            display: flex;
            gap: 10px 20px;
            justify-content: center;
            flex-wrap: wrap;
            margin-bottom: 15px;
          }
          
          .header-item {
            display: flex;
            align-items: center;
            font-size: 1.5rem;
            color: #111;
          }
          
          .header-item svg {
            margin-right: 5px;
            width: 10px;
            height: 10px;
          }
          
          .summary {
            font-size: 1.4rem;
            line-height: 1.5rem;
            margin-bottom: 20px;
            text-align: center;
            color: #111;
          }
          
          /* Work Experience */
          .work-item {
            margin-bottom: 10px;
          }
          
          .work-header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 2px;
          }
          
          .work-position {
            font-style: italic;
            font-size: 1.4rem;
            margin-bottom: 3px;
            color: #111;
          }
          
          .work-dates {
            display: flex;
            font-style: italic;
            font-size: 1.4rem;
            color: #111;
          }
          
          .work-summary {
            margin-bottom: 5px;
            color: #111;
          }
          
          .highlights {
            padding-left: 20px;
            line-height: 16px;
            margin-bottom: 5px;
          }
          
          .highlights li {
            font-size: 1.4rem;
            line-height: 1.5rem;
            color: #111;
            position: relative;
          }
          
          .highlights li::before {
            content: '\2022';
            display: inline-block;
            width: 1em;
            margin-left: -1em;
            line-height: 10px;
          }
          
          .keywords {
            display: flex;
            flex-wrap: wrap;
            gap: 5px;
            margin-top: 5px;
            font-size: 1.2rem;
            color: #666;
          }
          
          .keyword {
            background: #f0f0f0;
            padding: 2px 6px;
            border-radius: 3px;
          }
          
          /* Skills */
          .skill-item {
            margin-bottom: 5px;
            display: flex;
            align-items: baseline;
          }
          
          .skill-name {
            font-weight: 600;
            font-size: 1.4rem;
            color: #000;
          }
          
          .skill-keywords {
            font-size: 1.4rem;
            margin-left: 5px;
            color: #111;
          }
          
          /* Education */
          .education-item {
            margin-bottom: 10px;
          }
          
          .education-header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 2px;
          }
          
          .education-degree {
            font-style: italic;
            font-size: 1.4rem;
            margin-bottom: 3px;
            color: #111;
          }
          
          .education-dates {
            font-style: italic;
            font-size: 1.4rem;
            color: #111;
          }
          
          /* Projects */
          .project-item {
            margin-bottom: 10px;
          }
          
          .project-header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 2px;
          }
          
          .project-dates {
            display: flex;
            font-style: italic;
            font-size: 1.4rem;
            color: #111;
          }
          
          .project-summary {
            margin-bottom: 5px;
            color: #111;
          }
          
          /* Certificates */
          .certificate-item {
            margin-bottom: 5px;
            display: flex;
            align-items: baseline;
          }
          
          .certificate-name {
            font-weight: 600;
            font-size: 1.4rem;
            color: #000;
          }
          
          .certificate-date {
            font-size: 1.4rem;
            margin-left: 5px;
            color: #111;
          }
          
          /* Tools */
          .tools-list {
            display: flex;
            flex-wrap: wrap;
            gap: 5px;
            font-size: 1.4rem;
            color: #111;
          }
          
          .tool-item::after {
            content: ',';
            margin-right: 5px;
          }
          
          .tool-item:last-child::after {
            content: '';
          }
          
          /* Responsive */
          @media print {
            .container {
              max-width: 100%;
            }
            
            .section {
              page-break-inside: avoid;
            }
          }
          
          @media (max-width: 768px) {
            html {
              font-size: 10px;
            }
            
            .work-header,
            .education-header,
            .project-header {
              flex-direction: column;
            }
            
            .header-info {
              flex-direction: column;
              align-items: center;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <!-- Header / Basics Section -->
          <xsl:apply-templates select="Schema_Resume_v1.1.0/basics"/>
          
          <!-- Work Experience Section -->
          <xsl:if test="Schema_Resume_v1.1.0/work/item">
            <div class="section">
              <h2>Work Experience</h2>
              <hr/>
              <div class="section-content">
                <xsl:apply-templates select="Schema_Resume_v1.1.0/work/item"/>
              </div>
            </div>
          </xsl:if>
          
          <!-- Projects Section -->
          <xsl:if test="Schema_Resume_v1.1.0/projects/item">
            <div class="section">
              <h2>Projects</h2>
              <hr/>
              <div class="section-content">
                <xsl:apply-templates select="Schema_Resume_v1.1.0/projects/item"/>
              </div>
            </div>
          </xsl:if>
          
          <!-- Education Section -->
          <xsl:if test="Schema_Resume_v1.1.0/education/item">
            <div class="section">
              <h2>Education</h2>
              <hr/>
              <div class="section-content">
                <xsl:apply-templates select="Schema_Resume_v1.1.0/education/item"/>
              </div>
            </div>
          </xsl:if>
          
          <!-- Certificates Section -->
          <xsl:if test="Schema_Resume_v1.1.0/certificates/item">
            <div class="section">
              <h2>Certificates</h2>
              <hr/>
              <div class="section-content">
                <xsl:apply-templates select="Schema_Resume_v1.1.0/certificates/item"/>
              </div>
            </div>
          </xsl:if>
          
          <!-- Skills Section -->
          <xsl:if test="Schema_Resume_v1.1.0/skills/item">
            <div class="section">
              <h2>Skills</h2>
              <hr/>
              <div class="section-content">
                <xsl:apply-templates select="Schema_Resume_v1.1.0/skills/item"/>
              </div>
            </div>
          </xsl:if>
          
          <!-- Tools Section -->
          <xsl:if test="Schema_Resume_v1.1.0/tools/item">
            <div class="section">
              <h2>Tools</h2>
              <hr/>
              <div class="section-content">
                <div class="tools-list">
                  <xsl:apply-templates select="Schema_Resume_v1.1.0/tools/item"/>
                </div>
              </div>
            </div>
          </xsl:if>
        </div>
      </body>
    </html>
  </xsl:template>
  
  <!-- Basics Template -->
  <xsl:template match="basics">
    <div class="section">
      <h1><xsl:value-of select="name"/></h1>
      <div class="section-content">
        <div class="header-info">
          <!-- Location: Region, Country -->
          <xsl:if test="location/region or location/countryCode">
            <div class="header-item">
              📍 
              <xsl:if test="location/region">
                <xsl:value-of select="location/region"/>
              </xsl:if>
              <xsl:if test="location/region and location/countryCode">
                <xsl:text>, </xsl:text>
              </xsl:if>
              <xsl:if test="location/countryCode">
                <xsl:value-of select="location/countryCode"/>
              </xsl:if>
              <xsl:if test="location/remote = 'true'">
                <xsl:text> (Remote)</xsl:text>
              </xsl:if>
            </div>
          </xsl:if>
          
          <!-- Nationalities -->
          <xsl:if test="nationalities/item">
            <div class="header-item">
              🌍 
              <xsl:for-each select="nationalities/item">
                <xsl:value-of select="country"/>
                <xsl:if test="position() != last()">
                  <xsl:text>, </xsl:text>
                </xsl:if>
              </xsl:for-each>
            </div>
          </xsl:if>
          
          <xsl:if test="email">
            <div class="header-item">
              <xsl:value-of select="email"/>
            </div>
          </xsl:if>
          <xsl:if test="phone">
            <div class="header-item">
              <xsl:value-of select="phone"/>
            </div>
          </xsl:if>
          <xsl:if test="url">
            <div class="header-item">
              <a href="{url}" target="_blank"><xsl:value-of select="url"/></a>
            </div>
          </xsl:if>
          <xsl:for-each select="profiles/item">
            <div class="header-item">
              <xsl:choose>
                <xsl:when test="network = 'GitHub'">GH:</xsl:when>
                <xsl:when test="network = 'LinkedIn'">IN:</xsl:when>
                <xsl:when test="network = 'StackExchange'">SE:</xsl:when>
                <xsl:otherwise></xsl:otherwise>
              </xsl:choose>
              <xsl:text> </xsl:text>
              <a href="{url}" target="_blank"><xsl:value-of select="username"/></a>
            </div>
          </xsl:for-each>
        </div>
        <xsl:if test="label">
          <p class="summary" style="font-weight: 600; font-size: 1.5rem; margin-bottom: 10px;">
            <xsl:value-of select="label"/>
          </p>
        </xsl:if>
        <xsl:if test="summary">
          <p class="summary">
            <xsl:value-of select="summary"/>
          </p>
        </xsl:if>
      </div>
    </div>
  </xsl:template>
  
  <!-- Work Item Template -->
  <xsl:template match="work/item">
    <div class="work-item">
      <div class="work-header">
        <h3><xsl:value-of select="position"/></h3>
        <div class="work-dates">
          <xsl:call-template name="format-date">
            <xsl:with-param name="date" select="startDate"/>
          </xsl:call-template>
          <xsl:text> — </xsl:text>
          <xsl:choose>
            <xsl:when test="endDate">
              <xsl:call-template name="format-date">
                <xsl:with-param name="date" select="endDate"/>
              </xsl:call-template>
            </xsl:when>
            <xsl:otherwise>Present</xsl:otherwise>
          </xsl:choose>
        </div>
      </div>
      <div class="work-position">
        <xsl:value-of select="name"/>
        <xsl:if test="location">
          <xsl:text> — </xsl:text>
          <xsl:value-of select="location"/>
        </xsl:if>
      </div>
      <xsl:if test="summary">
        <p class="work-summary">
          <xsl:value-of select="summary"/>
        </p>
      </xsl:if>
      <xsl:if test="highlights/item">
        <ul class="highlights">
          <xsl:for-each select="highlights/item">
            <li><xsl:value-of select="."/></li>
          </xsl:for-each>
        </ul>
      </xsl:if>
      <xsl:if test="keywords/item">
        <div class="keywords">
          <xsl:for-each select="keywords/item">
            <span class="keyword"><xsl:value-of select="."/></span>
          </xsl:for-each>
        </div>
      </xsl:if>
    </div>
  </xsl:template>
  
  <!-- Project Item Template -->
  <xsl:template match="projects/item">
    <div class="project-item">
      <div class="project-header">
        <h3><xsl:value-of select="name"/></h3>
        <div class="project-dates">
          <xsl:if test="startDate">
            <xsl:call-template name="format-date">
              <xsl:with-param name="date" select="startDate"/>
            </xsl:call-template>
          </xsl:if>
          <xsl:if test="endDate">
            <xsl:text> — </xsl:text>
            <xsl:call-template name="format-date">
              <xsl:with-param name="date" select="endDate"/>
            </xsl:call-template>
          </xsl:if>
        </div>
      </div>
      <xsl:if test="summary">
        <p class="project-summary">
          <xsl:value-of select="summary"/>
        </p>
      </xsl:if>
      <xsl:if test="highlights/item">
        <ul class="highlights">
          <xsl:for-each select="highlights/item">
            <li><xsl:value-of select="."/></li>
          </xsl:for-each>
        </ul>
      </xsl:if>
    </div>
  </xsl:template>
  
  <!-- Education Item Template -->
  <xsl:template match="education/item">
    <div class="education-item">
      <div class="education-header">
        <h3><xsl:value-of select="institution"/></h3>
        <div class="education-dates">
          <xsl:if test="startDate">
            <xsl:call-template name="format-date">
              <xsl:with-param name="date" select="startDate"/>
            </xsl:call-template>
            <xsl:text> — </xsl:text>
          </xsl:if>
          <xsl:if test="endDate">
            <xsl:call-template name="format-date">
              <xsl:with-param name="date" select="endDate"/>
            </xsl:call-template>
          </xsl:if>
        </div>
      </div>
      <div class="education-degree">
        <xsl:if test="studyType">
          <xsl:value-of select="studyType"/>
          <xsl:if test="area">
            <xsl:text> in </xsl:text>
          </xsl:if>
        </xsl:if>
        <xsl:value-of select="area"/>
      </div>
    </div>
  </xsl:template>
  
  <!-- Certificate Item Template -->
  <xsl:template match="certificates/item">
    <div class="certificate-item">
      <span class="certificate-name"><xsl:value-of select="name"/></span>
      <xsl:if test="date">
        <span class="certificate-date">
          (<xsl:value-of select="date"/>)
        </span>
      </xsl:if>
    </div>
  </xsl:template>
  
  <!-- Skills Item Template -->
  <xsl:template match="skills/item">
    <div class="skill-item">
      <span class="skill-name"><xsl:value-of select="name"/>:</span>
      <span class="skill-keywords">
        <xsl:for-each select="keywords/item">
          <xsl:value-of select="."/>
          <xsl:if test="position() != last()">, </xsl:if>
        </xsl:for-each>
      </span>
    </div>
  </xsl:template>
  
  <!-- Tools Item Template -->
  <xsl:template match="tools/item">
    <div class="tool-item">
      <span class="tool-name"><xsl:value-of select="name"/>:</span>
      <span class="tool-keywords">
        <xsl:for-each select="keywords/item">
          <xsl:value-of select="."/>
          <xsl:if test="position() != last()">, </xsl:if>
        </xsl:for-each>
      </span>
    </div>
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
