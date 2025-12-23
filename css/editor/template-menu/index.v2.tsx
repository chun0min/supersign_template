import ICSample from '@/assets/icons/editor/widget/ic_image_sample.png'
import DraggableResizable from '@/components/atoms/editor/draggable-resizable'
import { EditorContentState, useEditorStore } from '@/stores/editor-store'
import { RefObject } from 'react'
import styles from './index.v2.module.css'

interface MenuProps {
  id: number
  editContent: EditorContentState
  parentRef: RefObject<HTMLDivElement>
  isPreview?: boolean
  isMasterLock?: boolean
}

const Menu: React.FC<MenuProps> = ({
  id,
  editContent: content,
  parentRef,
  isPreview,
  isMasterLock = false,
}) => {
  /* Ref */
  const es = useEditorStore()
  const options = es.getEditorOptionMenu(id)
  const { menu_item: menu, custom } = options
  // const isShowCustomPanel =
  //   es.getInformationSubMode() === 'MENU-V2-CUSTOM-SETTINGS'
  if (!options.name) options.name = es.getEditorOptionMenuSubItem(id, 'name')
  if (!options.priceType)
    options.priceType = es.getEditorOptionMenuSubItem(id, 'priceType')
  if (!options.price) options.price = es.getEditorOptionMenuSubItem(id, 'price')
  if (!options.calories)
    options.calories = es.getEditorOptionMenuSubItem(id, 'calories')
  if (!options.allergies)
    options.allergies = es.getEditorOptionMenuSubItem(id, 'allergies')
  if (!options.description)
    options.description = es.getEditorOptionMenuSubItem(id, 'description')
  if (!options.custom)
    options.custom = es.getEditorOptionMenuSubItem(id, 'custom')

  const widgetClass = es.getWidgetClass(id)

  /* Store */

  /* Normal Variable */

  const { menu_list: list } = menu || {}
  const { item_spacing } = custom || {}

  return (
    <DraggableResizable
      id={id}
      selectedId={id}
      draggableYN={!isMasterLock}
      resizableYN={!isMasterLock}
      scalableYN={false}
      parentRef={parentRef}
      isPreview={isMasterLock || isPreview}
    >
      <div
        className={`${styles['container']} ${styles[widgetClass ?? '']}`}
        style={{ gap: item_spacing }}
      >
        {list
          ?.filter((m) => m.enable)
          .map((m, i) => <MenuItem key={i} menu={m} options={options} />)}
      </div>
    </DraggableResizable>
  )
}

export default Menu

const MenuItem = ({ menu, options }) => {
  const { custom } = options
  const { horizontal_scale: width } = custom

  const getStyle = () => {
    const s = {}
    if (menu.background) {
      s['backgroundImage'] = `url(${menu.background.item_url})`
      s['backgroundSize'] = 'cover'
      s['backgroundPosition'] = 'center'
      s['backgroundRepeat'] = 'no-repeat'
    }
    return s
  }

  return (
    <div
      className={`${styles['menu']} ${custom.reverse ? styles['reverse'] : ''}`}
      style={getStyle()}
    >
      <div className={styles['section']} style={{ width: `${width}%` }}>
        <BlueSection menu={menu} options={options} />
      </div>
      <div
        className={`${styles['section']} ${styles['others']}`}
        style={{ width: `${100 - width}%` }}
      >
        <OrangeSection menu={menu} options={options} />
        <PurpleSection menu={menu} options={options} />
      </div>
    </div>
  )
}

const BlueSection = ({ menu, options }) => {
  const { custom } = options
  const section = custom.section.find((s) => s.id === 'blue')
  return (
    <div
      className={styles['blue']}
      style={{
        flexDirection: section.direction === 'vertical' ? 'row' : 'column',
      }}
    >
      {section.list.map((id, i) => (
        <Item key={i} id={id} menu={menu} options={options} />
      ))}
    </div>
  )
}

const OrangeSection = ({ menu, options }) => {
  const { custom } = options
  const { vertical_scale: height } = custom
  const section = custom.section.find((s) => s.id === 'orange')
  return (
    <div
      className={styles['orange']}
      style={{
        height: `${height}%`,
        flexDirection: section.direction === 'vertical' ? 'row' : 'column',
      }}
    >
      {section.list.map((id, i) => (
        <Item key={i} id={id} menu={menu} options={options} />
      ))}
    </div>
  )
}

const PurpleSection = ({ menu, options }) => {
  const { custom } = options
  const { vertical_scale: height } = custom
  const section = custom.section.find((s) => s.id === 'purple')
  return (
    <div
      className={styles['purple']}
      style={{
        height: `${100 - height}%`,
        flexDirection: section.direction === 'vertical' ? 'row' : 'column',
      }}
    >
      {section.list.map((id, i) => (
        <Item key={i} id={id} menu={menu} options={options} />
      ))}
    </div>
  )
}

const Item = ({ id, menu, options }) => {
  // const { priceType } = options.menu
  const { custom, menu_item } = options
  const { price_type_text: types } = menu_item
  switch (id) {
    case 'image': {
      const getImageStyle = () => {
        const s = {}
        s['transform'] = `scale(${custom.scale})`
        return s
      }
      return (
        <div className={styles['item-image']}>
          <img
            src={menu.image?.item_url || ICSample}
            alt={menu.menu_name}
            style={getImageStyle()}
          />
        </div>
      )
    }
    case 'name': {
      return (
        <div className={styles['item-name']} style={getStyles(options.name)}>
          {menu.menu_name}
        </div>
      )
    }
    case 'price': {
      const getUnitStyle = () => {
        const s = { ...getStyles(options.price) }
        if (custom.price_type === 'above') {
          s['display'] = 'block'
        } else {
          s['marginRight'] = '0.5rem'
        }
        return s
      }
      const getCostStyle = () => {
        const s = { ...getStyles(options.price) }
        if (custom.calories === 'below') {
          s['display'] = 'inline-block'
          s['width'] = '100%'
        }
        return s
      }
      const getCaloryStyle = () => {
        const s = { ...getStyles(options.calories) }
        if (custom.calories === 'below') {
          s['display'] = 'block'
        } else {
          s['marginLeft'] = '1rem'
        }
        return s
      }
      return (
        <div className={styles['item-price']}>
          {types.map((text, i) => (
            <div key={i} className={styles['price']}>
              <div
                className={styles['price-label']}
                style={getStyles(options.priceType)}
              >
                {text}
              </div>
              <div className={styles['price-value']}>
                <span className={styles['unit']} style={getUnitStyle()}>
                  {getPriceUnit(menu_item.price_unit)}
                </span>
                <span className={styles['cost']} style={getCostStyle()}>
                  {menu.price[i]}
                </span>
                <span className={styles['calory']} style={getCaloryStyle()}>
                  {menu.calory[i]}
                  <span
                    className={styles['calory-unit']}
                    style={getStyles(options.calories)}
                  >
                    kcal
                  </span>
                </span>
              </div>
            </div>
          ))}
        </div>
      )
    }
    case 'description': {
      return (
        <div className={styles['item-description']}>
          <div
            className={styles['description']}
            style={getStyles(options.description)}
          >
            {menu.description}
          </div>
          <div
            className={styles['allergy']}
            style={getStyles(options.allergies)}
          >
            {menu.allergy}
          </div>
        </div>
      )
    }
    default:
      return null
  }
}

const getPriceUnit = (unit: string) => {
  switch (unit) {
    case 'us':
      return '$'
    case 'eu':
      return '€'
    case 'kr':
      return '₩'
    case 'jp':
      return '¥'
    default:
      return unit
  }
}

const getStyles = (params: any) => {
  const s = {}

  if (params.font_name) s['fontFamily'] = params.font_name
  if (params.font_size) s['fontSize'] = params.font_size + 'px'
  if (params.color) s['color'] = params.color
  if (params.style_bold) s['fontWeight'] = 'bold'
  if (params.style_italic) s['fontStyle'] = 'italic'
  if (params.style_line) s['textDecoration'] = 'underline'
  if (params.style_sub) s['textDecoration'] = 'line-through'
  if (params.alignment) s['textAlign'] = params.alignment

  return s
}
