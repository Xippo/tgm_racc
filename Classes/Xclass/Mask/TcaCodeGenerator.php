<?php
namespace TGM\TgmRacc\Xclass\Mask;


/***************************************************************
 *
 *  Copyright notice
 *
 *  (c) 2016 Oliver Pfaff <op@teamgeist-medien.de>, Teamgeist Medien GbR
 *
 *  All rights reserved
 *
 *  This script is part of the TYPO3 project. The TYPO3 project is
 *  free software; you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation; either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  The GNU General Public License can be found at
 *  http://www.gnu.org/copyleft/gpl.html.
 *
 *  This script is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  This copyright notice MUST APPEAR in all copies of the script!
 ***************************************************************/

/**
 * TcaCodeGenerator Xclass
 */
class TcaCodeGenerator extends \MASK\Mask\CodeGenerator\TcaCodeGenerator
{
    public function setElementsTca($tca){
        parent::setElementsTca($tca);
        foreach ($GLOBALS['TCA']['tt_content']['types'] as $key => $type){
            //Add accordion Fields to all mask elements. The xclass is only loaded when mask is installed. See localconf
            if(substr($key,0,5) === 'mask_'){
                $GLOBALS['TCA']['tt_content']['types'][$key]['showitem'] .= ', --div--;LLL:EXT:tgm_racc/Resources/Private/Language/locallang_db.xlf:tab,tgm_accordion,tgm_accordion_open';
            }
        }
    }
}